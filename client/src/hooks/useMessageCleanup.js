import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearOldAlerts } from "../store/webSocketSlice";
export const useMessageCleanup = () => {
    const dispatch = useDispatch();
    const { allMessages, cheapOrders, solidOrders, bigBiznis } = useSelector((state) => state.webSocket);
    useEffect(() => {
        const hasMessages = [allMessages, cheapOrders, solidOrders, bigBiznis]
            .some(arr => arr.length > 0);
        if (!hasMessages)
            return;
        const intervalId = setInterval(() => {
            dispatch(clearOldAlerts());
        }, 1000);
        return () => clearInterval(intervalId);
    }, [allMessages.length, cheapOrders.length, solidOrders.length, bigBiznis.length, dispatch]);
};
