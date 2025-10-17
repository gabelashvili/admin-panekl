import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import List from "../components/home/List";
import Pagination from "../components/ui/pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "../components/form/date-picker";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import { useTranslation } from "react-i18next";
import { useDownloadCSV, useNewRequestsQuery, useRequestsQuery } from "../store/server/requets/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import Button from "../components/ui/button";
import { DocsIcon } from "../icons";
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
  const { refetch: refetchDownloadCSV, isLoading: isDownloading } = useDownloadCSV()  
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [page, setPage] = useState(0);
  const [URLSearchParams] = useSearchParams()
  const filters = {
    fromDate: dateRange?.[0] ? toLocalISOString(dateRange?.[0]) : null, 
    toDate: dateRange?.[1] ? toLocalISOString(dateRange?.[1]) : null, 
    page: page + 1, 
    pageSize: ROWS_PER_PAGE,
    searchTerm: URLSearchParams.get('search') || null
  }
  const { data: allData, isLoading: isAllDataLoading,  } = useRequestsQuery(filters)
  const {data: activeData, isPending: isActiveDataPending} = useNewRequestsQuery()
  const [allItems, setAllItems] = useState<typeof activeData | null>(null)
  const interval = useRef<ReturnType<typeof setTimeout> | null>(null);   
  const audioRef = useRef<HTMLAudioElement>(null);
  const isAudioPlaying = useRef(false);
  const lastAudioPlayTime = useRef<Date | null>(null);
  const { t } = useTranslation();

  const downloadStatisticsCSV = async () => {
    const { data } = await refetchDownloadCSV();
    if (data) {
      const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
    
      const a = document.createElement("a");
      a.href = url;
      a.download = "statistics.csv";
      document.body.appendChild(a);
      a.click();
    
      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  };
  
  const ringBell = useCallback(() => {
    if(interval.current) {
      clearTimeout(interval.current);
    }
    interval.current = setTimeout(() => {
      try {
        console.log(lastAudioPlayTime.current && new Date().getTime() - lastAudioPlayTime.current.getTime() > 5000)
        if(((lastAudioPlayTime.current && new Date().getTime() - lastAudioPlayTime.current.getTime() > 5000) || !lastAudioPlayTime.current)) {
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




  const previusActivItemsRef = useRef<typeof activeData | null>(null)

  useEffect(() => {
    if (!activeData) {

      return
    };
  

    if(!previusActivItemsRef.current && activeData) {
      const isPendingItems = activeData.helpRequests.filter((r) => r.status === "Pending")
      if(isPendingItems.length > 0) {
        ringBell()
      }
    }
    
    const curr = activeData;
  
    // Run only if we have previous data (i.e., not on first render)
    if (previusActivItemsRef.current) {
      const prevIds = new Set(previusActivItemsRef.current.helpRequests.map((r) => r.id));
      const currIds = new Set(curr.helpRequests.map((r) => r.id));
      console.log("prevIds", prevIds, currIds)
  
      // Added items → exist in current but not in previous
      const added = curr.helpRequests.filter((r) => !prevIds.has(r.id));
  
      // Removed items → exist in previous but not in current
      const removed = previusActivItemsRef.current.helpRequests.filter((r) => !currIds.has(r.id));
  
      if (added.length > 0) {
        ringBell()
        console.log("🟢 Added items:", added);
        queryClient.invalidateQueries({queryKey: [ requestsTags.requests ]})
      }
  
      if (removed.length > 0) {
        console.log("🔴 Removed items:", removed);
        queryClient.invalidateQueries({queryKey: [ requestsTags.requests ]})
      }
    }
  
    // Update ref AFTER comparison
    previusActivItemsRef.current = {...activeData};
  }, [activeData]);
  return (
    <>
      <audio controls ref={audioRef} className="hidden" onPlay={() => {
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
                <Button loading={isDownloading} onClick={downloadStatisticsCSV} variant="outline" size="sm" className="w-max min-w-max">სტატისტიკა <DocsIcon className="size-5" /></Button>
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
            activeItems={activeData?.helpRequests || []}
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