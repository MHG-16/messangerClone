"use client";

import useActiveChannel from "@/hooks/useActiveChannels";

const ActiveStatus = () => {
    useActiveChannel();
    return null;
}

export default ActiveStatus;