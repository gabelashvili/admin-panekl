import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import List from "../components/home/List";
import Pagination from "../components/ui/pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "../components/form/date-picker";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import { useTranslation } from "react-i18next";
import { useNewRequestsQuery, useRequestsQuery } from "../store/server/requets/queries";
import { useQueryClient } from "@tanstack/react-query";
import requestsTags from "../store/server/requets/tags";

dayjs.extend(isBetween);

const ROWS_PER_PAGE = 12;

function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString();
}

const Home = () => {
  const queryClient = useQueryClient()
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [page, setPage] = useState(0);
  const filters = {
    fromDate: dateRange?.[0] ? toLocalISOString(dateRange?.[0]) : null, 
    toDate: dateRange?.[1] ? toLocalISOString(dateRange?.[1]) : null, 
    page: page + 1, 
    pageSize: ROWS_PER_PAGE
  }
  const { data: allData, isLoading: isAllDataLoading,  } = useRequestsQuery(filters)
  const {data: activeData, isPending: isActiveDataPending} = useNewRequestsQuery()
  const [activeItems, setActiveItems] = useState<typeof activeData | null>(null)
  const [allItems, setAllItems] = useState<typeof activeData | null>(null)
  const interval = useRef<ReturnType<typeof setTimeout> | null>(null);   
  const audioRef = useRef<HTMLAudioElement>(null);
  const isAudioPlaying = useRef(false);
  const lastAudioPlayTime = useRef<Date | null>(null);
  const { t } = useTranslation();
  
  const ringBell = useCallback(() => {
    if(interval.current) {
      clearTimeout(interval.current);
    }
    interval.current = setTimeout(() => {
      try {
        if((lastAudioPlayTime.current && new Date().getTime() - lastAudioPlayTime.current.getTime() > 5000) || !lastAudioPlayTime.current) {
          audioRef.current?.play()
          lastAudioPlayTime.current = new Date();
        }
      } catch (error) {
        console.error(error);
      }
    }, 700);
  }, []);

  useEffect(() => {
    if(dateRange) {
      setPage(0);
    }
  }, [dateRange]);

  useEffect(() => {
    setAllItems(allData || null)
  }, [allData])


  useEffect(() => {
    if(!activeData) return
    if(!activeItems) {
      setActiveItems(activeData)
    }
    else {
      const isActiveItemRemoved = activeItems.helpRequests.some(x => {
        return !activeData?.helpRequests.find(y => x.id === y.id)
      })
      
      const isActiveItemAdded = activeData?.helpRequests.some(x => {
        return !activeItems?.helpRequests.find(y => x.id === y.id)
      })
      if(isActiveItemAdded) {
        ringBell()
      }
      if(isActiveItemAdded || isActiveItemRemoved) {
          setActiveItems(activeData)
          queryClient.invalidateQueries({queryKey: [ requestsTags.requests ]})
      }
    }
  }, [activeData, activeItems, queryClient, ringBell])

  return (
    <>
      <audio controls autoPlay ref={audioRef} className="hidden" onPlay={() => {
        console.log('Audio played');
        isAudioPlaying.current = true;
      }} onPause={() => {
        console.log('Audio paused');
        isAudioPlaying.current = false;
      }}>
            <source src={'/ringtones/ringtone.wav'} type="audio/ogg" />
            Your browser does not support the audio element.
      </audio>
      <PageBreadcrumb pageTitle="" />
      <div className="">
        <ComponentCard
          title={t('home.title')}
          bodyClassName="sm:p-0"
          renderHeader={() => {
            return (
              <div className="flex items-center gap-2 w-fit pr-6">
                {/* <Select
                  placeholder="Select Status"
                  options={[]}
                  value={status}
                  onChange={(value) => setStatus(value)}
                /> */}
                <DatePicker
                  id="date-picker"
                  placeholder={t('home.table.filters.selectDate')}
                  mode="range"
                  onChange={setDateRange}
                  inputClassName="w-64"
                />
              </div>
            );
          }}
        >
          <List 
            pending={!allData || !activeData || isAllDataLoading || isActiveDataPending}
            data={allItems?.helpRequests || []}
            activeItems={activeItems?.helpRequests || []}
          />
          <div className="border-t rounded-b-2xl py-4 px-6">
           {allData && <Pagination
              totalPages={allData?.totalPages}
              page={page}
              setPage={setPage}
            />}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default Home;