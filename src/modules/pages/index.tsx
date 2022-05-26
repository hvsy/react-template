import useSWR from "swr";

export default function Hello(){
    const {data:ping} = useSWR('/ping');
    return <div className={'w-full h-full flex flex-col justify-center items-center'}>
        <div>
            Hello React Template!!!
        </div>
        <div>
            {JSON.stringify(ping)}
        </div>
    </div>;
};
