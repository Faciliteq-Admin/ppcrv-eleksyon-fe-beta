import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Loader from "../../../components/Loader";
import { getRequest } from "../../../utils/apiHelpers";
import EmptyCard from "../../../components/EmptyCard";

export default function NationalElectionListPage(props: any) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [senators, setSenators] = useState<any>();
    const [partyLists, setPartyLists] = useState<any>();
    let processing = false;

    useEffect(() => {

        let mounted = false;
        getData();

        return () => {
            mounted = true;
        };
    }, []);

    const getData = async () => {
        if (processing) return;

        processing = true;
        setLoading(true);
        let senatorContestRes = await getRequest('/contests?contestType=national&contestPosition=senator');
        if (senatorContestRes && senatorContestRes.data && senatorContestRes.data.length > 0) {

            let senatorRes = await getRequest(`/candidates?contestCode=${senatorContestRes.data[0].contestCode}`);
            if (senatorRes.data) {
                setSenators(senatorRes.data.items);
            }
        }

        let plContestRes = await getRequest('/contests?contestType=national&contestPosition=party list');
        if (plContestRes && plContestRes.data && plContestRes.data.length > 0) {
            let plRes = await getRequest(`/candidates?contestCode=${plContestRes.data[0].contestCode}`);
            if (plRes.data) {
                setPartyLists(plRes.data.items);
            }
        }
        setLoading(false);
        processing = false;
    }

    const handleView = (e: any, index: any) => {
        // navigate(`/precints/${(data as any[])[index].id}`, { state: data[index] });
    }

    const handleAddNew = () => {
        // navigate('/precints/new');
    }

    return (
        <div>
            {loading && <Loader />}
            <span className="text-sm font-medium">National Elections</span>

            <EmptyCard>
                <div className="mb-4 w-full">
                    <p className="pb-2 text-sm font-medium">SENATORS</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                    {senators && senators.map((s: any, idx: number) => {
                        const cand = s.candidateName.split('(');
                        const name = cand[0];
                        const party = cand[1].replace(')', '');
                        return (
                            <div key={idx} className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center gap-2 m-1">
                                    <div className="p-1 size-7 bg-slate-700 rounded-full">
                                        <p className="text-sm font-medium text-center text-white">{`${s.totalizationOrder}`}</p>
                                    </div>
                                    <p className="text-sm font-medium capitalize">{name.toLowerCase()}</p>
                                    <span className="text-sm font-medium">({party})</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </EmptyCard>

            <EmptyCard>
                <div className="mb-4 w-full">
                    <p className="pb-2 text-sm font-medium">PARTY LISTS</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                    {partyLists && partyLists.map((s: any, idx: number) => {
                        return (
                            <div key={idx} className="flex flex-row justify-between m-1 items-center">
                                <div className="flex flex-row items-center gap-2">
                                    <div className="p-1 size-7 bg-slate-700 rounded-full">
                                        <p className="text-sm font-medium text-center text-white">{`${s.totalizationOrder}`}</p>
                                    </div>
                                    <p className="text-sm font-medium capitalize">{`${s.candidateName}`}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </EmptyCard>
        </div>
    );
}