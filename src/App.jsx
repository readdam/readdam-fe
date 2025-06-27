// 🔹 외부 라이브러리
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import { getFcmToken } from './fcmToken';
import { messaging, onMessage } from './firebase';

// 🔹 스크롤탑 설정
import ScrollToTop from '@components/ScrollToTop';

// 🔹 라우트 설정
import AdminRoutes from '@routes/AdminRoutes';
import UserRoutes from '@routes/UserRoutes';
import MyRoutes from '@routes/MyRoutes';

// 🔹 관리자 페이지
import PlaceList from '@pages/admin/PlaceList';
import PlaceAdd from '@pages/admin/PlaceAdd';
import PlaceEdit from '@pages/admin/PlaceEdit';
import OtherPlaceList from '@pages/admin/OtherPlaceList';
import OtherPlaceAdd from '@pages/admin/OtherPlaceAdd';
import OtherPlaceEdit from '@pages/admin/OtherPlaceEdit';
import AdminUserList from '@pages/admin/AdminUserList';
import AdminUserDeletedList from '@pages/admin/AdminUserDeletedList';
import AdminClassList from '@pages/admin/AdminClassList';
import AdminClassDetail from '@pages/admin/AdminClassDetail';
import PlaceReservationList from '@pages/admin/PlaceReservationList';
import AdminPointStats from '@pages/admin/AdminPointStats';
import AdminReportList from '@pages/admin/AdminReportList';
import AdminAlertList from '@pages/admin/AdminAlertList';
import AdminAlertCreate from '@pages/admin/AdminAlertCreate';
import AdminNotice from '@pages/admin/AdminNotice';
import AdminEventReg from '@pages/admin/AdminEventReg';
import AdminEventJoinedList from '@pages/admin/AdminEventJoinedList';
import AdminInquiryList from '@pages/admin/AdminInquiryList';
import AdminBannerList from '@pages/admin/AdminBannerList';

// 🔹 사용자 페이지
import Home from '@pages/user/Home';
import Login from '@pages/user/Login';
import Join from '@pages/user/Join';
import OAuthRedirect from '@pages/user/OAuthRedirect';
import Token from '@pages/user/Token';
import ClassList from '@pages/user/ClassList';
import ClassCreate from '@pages/user/ClassCreate';
import ClassDetail from '@pages/user/ClassDetail';
import Place from '@pages/user/Place';
import PlaceDetail from '@pages/user/PlaceDetail';
import BookPage from '@pages/user/BookPage';
import BookSearch from '@pages/user/BookSearch';
import BookDetail from '@pages/user/BookDetail';
import Notice from '@pages/user/Notice';
import SearchResult from '@pages/user/SearchResult';
import WriteList from '@pages/user/WriteList';
import WriteShortList from '@pages/user/WriteShortList';
import WriteDetail from '@pages/user/WriteDetail';
import WriteCreate from '@pages/user/WriteCreate';
import WriteModify from '@pages/user/WriteModify';

// 🔹 내정보(MyPage)
import MyProfile from '@pages/my/MyProfile';
import MyLibrary from '@pages/my/MyLibrary';
import MyLikeClass from '@pages/my/MyLikeClass';
import MyLikePlace from '@pages/my/MyLikePlace';
import MyLikeWrite from '@pages/my/MyLikeWrite';
import MyLikeBook from '@pages/my/MyLikeBook';
import MyClassContinue from '@pages/my/MyClassContinue';
import MyClassEnd from '@pages/my/MyClassEnd';
import MyWrite from '@pages/my/MyWrite';
import MyWriteShort from '@pages/my/MyWriteShort';
import MyWriteComment from '@pages/my/MyWriteComment';
import MyReviewBook from '@pages/my/MyReviewBook';
import MyReviewClass from '@pages/my/MyReviewClass';
import MyReservation from '@pages/my/MyReservation';
import MyPointCharge from '@pages/my/MyPointCharge';
import MyPointList from '@pages/my/MyPointList';
import MyAlert from '@pages/my/MyAlert';
import MyInquiry from '@pages/my/MyInquiry';
import MyInquiryWrite from '@pages/my/MyInquiryWrite';
import Success from '@pages/my/Success';
import Fail from '@pages/my/Fail';



function App() {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🔔 Foreground 알림 수신:', payload);
  
      const { title, body, icon } = payload.notification;
  
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico', 
      });
  
    });
  
    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/token" element={<Token />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />

        <Route element={<AdminRoutes />}>
          <Route path="/admin/userList" element={<AdminUserList />} />
          <Route
            path="/admin/userDeletedList"
            element={<AdminUserDeletedList />}
          />
          <Route path="/admin/classList" element={<AdminClassList />} />
          <Route path="/admin/classDetail" element={<AdminClassDetail />} />
          <Route path="/admin/placeList" element={<PlaceList />} />
          <Route path="/admin/placeAdd" element={<PlaceAdd />} />
          <Route path="/admin/placeEdit/:placeId" element={<PlaceEdit />} />
          <Route
            path="/admin/placeReservationList"
            element={<PlaceReservationList />}
          />
          <Route path="/admin/otherPlaceList" element={<OtherPlaceList />} />
          <Route path="/admin/otherPlaceAdd" element={<OtherPlaceAdd />} />
          <Route path="/admin/pointStats" element={<AdminPointStats />} />
          <Route path="/admin/reportList" element={<AdminReportList />} />
          <Route path="/admin/alertList" element={<AdminAlertList />} />
          <Route path="/admin/alertCreate" element={<AdminAlertCreate />} />
          <Route path="/admin/notice" element={<AdminNotice />} />
          <Route path="/admin/eventReg" element={<AdminEventReg />} />
          <Route
            path="/admin/eventJoinedList"
            element={<AdminEventJoinedList />}
          />
          <Route path="/admin/inquiryList" element={<AdminInquiryList />} />
          <Route path="/admin/bannerList" element={<AdminBannerList />} />
        </Route>

        <Route element={<UserRoutes />}>
          <Route path="/join" element={<Join />} />
          <Route path="/placeDetail" element={<PlaceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-redirect" element={<OAuthRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/writeDetail/:id" element={<WriteDetail />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/writeList" element={<WriteList />} />
          <Route path="/place" element={<Place />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/bookSearch" element={<BookSearch />} />
          <Route path="/bookDetail/:isbn" element={<BookDetail />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/writeDetail" element={<WriteDetail />} />
          <Route path="/writeCreate" element={<WriteCreate />} />
          <Route path="/writeModify" element={<WriteModify />} />
          <Route path="/classList" element={<ClassList />} />
          <Route path="/classCreate" element={<ClassCreate />} />
          <Route path="/classDetail/:classId" element={<ClassDetail />} />
          <Route path="/writeShortList" element={<WriteShortList />} />
        </Route>

        <Route element={<MyRoutes />}>
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/myLibrary" element={<MyLibrary />} />
          <Route path="/myLikeClass" element={<MyLikeClass />} />
          <Route path="/myLikePlace" element={<MyLikePlace />} />
          <Route path="/myLikeWrite" element={<MyLikeWrite />} />
          <Route path="/myLikeBook" element={<MyLikeBook />} />
          <Route path="/myClassContinue" element={<MyClassContinue />} />
          <Route path="/myClassEnd" element={<MyClassEnd />} />
          {/* <Route path="/myClassIMade" element={<MyClassIMade />} /> */}
          <Route path="/myWrite" element={<MyWrite />} />
          <Route path="/myWriteComment" element={<MyWriteComment />} />
          <Route path="/myWriteShort" element={<MyWriteShort />} />
          <Route path="/myReviewBook" element={<MyReviewBook />} />
          <Route path="/myReviewClass" element={<MyReviewClass />} />
          <Route path="/myReservation" element={<MyReservation />} />
          <Route path="/myPointCharge" element={<MyPointCharge />} />
          <Route path="/myPointList" element={<MyPointList />} />
          <Route path="/myAlert" element={<MyAlert />} />
          <Route path="/myInquiry" element={<MyInquiry />} />
          <Route path="/myInquiryWrite" element={<MyInquiryWrite />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;