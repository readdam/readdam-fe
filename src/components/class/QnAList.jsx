import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

const QnAList = ({classDetail}) => {
    const [user] = useAtom(userAtom);   //로그인한 사용자 정보
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLeader, setIsLeader] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!user?.username);

        if(classDetail?.leaderUsername && user?.username) {
            setIsLeader(classDetail.leaderUsername === user.username);
        }
    }, [user, classDetail]);
    
    return(
        <div>

        </div>
    )
}
export default QnAList;