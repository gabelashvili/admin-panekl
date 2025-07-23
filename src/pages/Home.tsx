import { faker } from "@faker-js/faker";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import List from "../components/home/List";
import Pagination from "../components/ui/pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from "../components/form/date-picker";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const georgianPrefixes = [
  "555",
  "557",
  "558",
  "559",
  "568",
  "570",
  "571",
  "574",
  "577",
  "579",
  "591",
  "592",
  "593",
  "595",
  "596",
  "597",
  "598",
  "599",
];
const statuses = ["Acknowledged", "Approved", "Completed", "Rejected by Parent"];

function generateGeorgianPhoneNumber() {
  const prefix = faker.helpers.arrayElement(georgianPrefixes);
  const subscriberNumber = faker.string.numeric(6); // 6-digit number
  return `+995 ${prefix} ${subscriberNumber.slice(0, 3)} ${subscriberNumber.slice(3)}`;
}

const locations = [
  { location: { latitude: 41.7102, longitude: 44.8031 } },
  { location: { latitude: 41.7708, longitude: 44.7512 } },
  { location: { latitude: 41.7284, longitude: 44.8456 } },
  { location: { latitude: 41.6889, longitude: 44.7257 } },
  { location: { latitude: 41.7632, longitude: 44.8823 } },
  { location: { latitude: 42.2738, longitude: 42.6931 } },
  { location: { latitude: 42.2561, longitude: 42.7389 } },
  { location: { latitude: 42.2845, longitude: 42.7094 } },
  { location: { latitude: 42.2362, longitude: 42.6742 } },
  { location: { latitude: 42.2910, longitude: 42.7205 } },
  { location: { latitude: 41.6453, longitude: 41.6382 } },
  { location: { latitude: 41.6728, longitude: 41.6614 } },
  { location: { latitude: 41.6211, longitude: 41.6217 } },
  { location: { latitude: 41.6592, longitude: 41.6698 } },
  { location: { latitude: 41.6335, longitude: 41.6521 } },
];


const createRequest = (status?: typeof statuses[number], isNew?: boolean) => ({
  requestId: faker.string.uuid().slice(0, 8),
  childName: faker.person.fullName(),
  childPhoneNumber: generateGeorgianPhoneNumber(),
  parentName: faker.person.fullName(),
  parentPhoneNumber: generateGeorgianPhoneNumber(),
  backupPhoneNumber: generateGeorgianPhoneNumber(),
  requestSource: faker.helpers.arrayElement(["Parent Approved", "Child Direct"]),
  requestTime: faker.date.between({
    from: "2025-01-01",
    to: "2025-07-23",
  }).toISOString(),
  location: faker.helpers.arrayElement(locations).location,
  status: status || faker.helpers.arrayElement(statuses),
  actions: ["Acknowledge", "Approve", "Mark as Completed", "Rejected by Parent"],
  isNew: isNew || false,
});

const requests = faker.helpers.multiple(() => createRequest(), { count: 161 });

const ROWS_PER_PAGE = 12;

const Home = () => {
  const [initialData, setInitialData] = useState<typeof requests>(requests);
  const [page, setPage] = useState(0);
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [newItems, setNewItems] = useState<typeof requests>([]);
  const interval = useRef<ReturnType<typeof setTimeout> | null>(null);   
  const audioRef = useRef<HTMLAudioElement>(null);

  const insertNewRequests = useCallback(() => {
    if(interval.current) {
      clearTimeout(interval.current);
    }
    interval.current = setTimeout(() => {
      try {
        audioRef.current?.play();
      } catch (error) {
        console.error(error);
      }
      const newRequests = faker.helpers.multiple(() => createRequest('Pending', true), { count: Math.floor(Math.random() * 3) + 1 });
      setNewItems([...newRequests, ...newItems]);
    }, newItems.length > 0 ?   Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000 : 700);
  }, [newItems]);

  useEffect(() => {
    if(dateRange) {
      const filtered = requests.filter((request) => dayjs(request.requestTime).isBetween(dateRange[0], dateRange[1], null, '[]') || dayjs(request.requestTime).isSame(dateRange[0], 'day') || dayjs(request.requestTime).isSame(dateRange[0]));
      setInitialData(filtered);
      setPage(0);
    }
  }, [dateRange]);

  useEffect(() => {
    insertNewRequests();

    return () => {
      if(interval.current) {
        clearTimeout(interval.current);
      }
    } 
  }, [insertNewRequests, newItems]);

  return (
    <>
      <audio controls autoPlay ref={audioRef} className="hidden" >
            <source src={'/ringtones/ringtone.wav'} type="audio/ogg" />
            Your browser does not support the audio element.
      </audio>
      <PageBreadcrumb pageTitle="" />
      <div className="">
        <ComponentCard
          title="List"
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
                  placeholder="Select Date"
                  mode="range"
                  onChange={setDateRange}
                  inputClassName="w-64"
                />
              </div>
            );
          }}
        >
          <List newItems={page === 0 ? newItems : []} data={initialData.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE)} />
          <div className="border-t rounded-b-2xl py-4 px-6">
            <Pagination
              totalPages={Math.ceil(initialData.length / ROWS_PER_PAGE)}
              page={page}
              setPage={setPage}
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default Home;