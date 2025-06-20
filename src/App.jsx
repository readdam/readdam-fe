import './index.css';
import { Routes, Route } from 'react-router-dom';
import PlaceList from '@pages/admin/PlaceList';
import AdminRoutes from '@routes/AdminRoutes';
import PlaceAdd from '@pages/admin/PlaceAdd';
import UserRoutes from '@routes/UserRoutes';
import PlaceDetail from '@pages/user/PlaceDetail';
import MyPointCharge from '@pages/my/MyPointCharge';
import MyRoutes from '@routes/MyRoutes';
import MyProfile from '@pages/my/MyProfile';
import MyLikeClass from '@pages/my/MyLikeClass';
import MyLikePlace from '@pages/my/MyLikePlace';
import MyLikeWrite from '@pages/my/MyLikeWrite';
import MyLikeBook from '@pages/my/MyLikeBook';
import MyAlert from '@pages/my/MyAlert';
import MyInquiry from '@pages/my/MyInquiry';
import MyPointList from '@pages/my/MyPointList';
import Join from '@pages/user/Join';
import AdminUserList from '@pages/admin/AdminUserList';
import AdminUserDeletedList from '@pages/admin/AdminUserDeletedList';
import AdminClassList from '@pages/admin/AdminClassList';
import AdminClassDetail from '@pages/admin/AdminClassDetail';
import Login from '@pages/user/Login';
import OAuthRedirect from '@pages/user/OAuthRedirect';
import Home from '@pages/user/Home';
import SearchResult from '@pages/user/SearchResult';
import WriteList from '@pages/user/WriteList';
import WriteShortList from '@pages/user/WriteShortList';
import Place from '@pages/user/Place';
import BookPage from '@pages/user/BookPage';
import BookSearch from '@pages/user/BookSearch';
import BookDetail from '@pages/user/BookDetail';
import Notice from '@pages/user/Notice';
import WriteDetail from '@pages/user/WriteDetail';
import WriteCreate from '@pages/user/WriteCreate';
import WriteModify from '@pages/user/WriteModify';
import MyLibrary from '@pages/my/MyLibrary';
import MyClassContinue from '@pages/my/MyClassContinue';
import MyClassEnd from '@pages/my/MyClassEnd';
import MyWrite from '@pages/my/MyWrite';
import MyWriteComment from '@pages/my/MyWriteComment';
import MyReviewBook from '@pages/my/MyReviewBook';
import MyReviewClass from '@pages/my/MyReviewClass';
import MyReservation from '@pages/my/MyReservation';
import Token from '@pages/user/Token';
import PlaceReservationList from '@pages/admin/PlaceReservationList';
import OtherPlaceList from '@pages/admin/OtherPlaceList';
import OtherPlaceAdd from '@pages/admin/OtherPlaceAdd';
import AdminPointStats from '@pages/admin/AdminPointStats';
import AdminReportList from '@pages/admin/AdminReportList';
import AdminAlertList from '@pages/admin/AdminAlertList';
import AdminAlertCreate from '@pages/admin/AdminAlertCreate';
import AdminNotice from '@pages/admin/AdminNotice';
import AdminEventReg from '@pages/admin/AdminEventReg';
import AdminEventJoinedList from '@pages/admin/AdminEventJoinedList';
import AdminInquiryList from '@pages/admin/AdminInquiryList';
import AdminBannerList from '@pages/admin/AdminBannerList';
import ClassList from '@pages/user/ClassList';
import ClassCreate from '@pages/user/ClassCreate';
import ClassDetail from '@pages/user/ClassDetail';
import PlaceEdit from '@pages/admin/PlaceEdit';
import OtherPlaceEdit from '@pages/admin/OtherPlaceEdit';
import PrivateRoute from '@routes/PrivateRoute';
import Success from '@pages/my/Success';
import Fail from '@pages/my/Fail';
import MyInquiryWrite from '@pages/my/MyInquiryWrite';


function App() {
  return (
    <>
      <Routes>
        <Route path="/token" element={<Token />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />

        <Route element={<AdminRoutes />}>
          <Route path="/adminUserList" element={<AdminUserList />} />
          <Route
            path="/adminUserDeletedList"
            element={<AdminUserDeletedList />}
          />
          <Route path="/adminClassList" element={<AdminClassList />} />
          <Route path="/adminClassDetail" element={<AdminClassDetail />} />
          <Route path="/adminPlaceList" element={<PlaceList />} />
          <Route path="/adminPlaceAdd" element={<PlaceAdd />} />
          <Route
            path="/adminPlaceReservationList"
            element={<PlaceReservationList />}
          />
          <Route path="/adminOtherPlaceList" element={<OtherPlaceList />} />
          <Route path="/adminOtherPlaceAdd" element={<OtherPlaceAdd />} />
          <Route path="/adminPointStats" element={<AdminPointStats />} />
          <Route path="/adminReportList" element={<AdminReportList />} />
          <Route path="/adminAlertList" element={<AdminAlertList />} />
          <Route path="/adminAlertCreate" element={<AdminAlertCreate />} />
          <Route path="/adminNotice" element={<AdminNotice />} />
          <Route path="/adminEventReg" element={<AdminEventReg />} />
          <Route
            path="/adminEventJoinedList"
            element={<AdminEventJoinedList />}
          />
          <Route path="/adminInquiryList" element={<AdminInquiryList />} />
          <Route path="/adminBannerList" element={<AdminBannerList />} />
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
          <Route path="/writeShortList" element={<WriteShortList />} />
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
          <Route path="/classDetail" element={<ClassDetail />} />
        </Route>

        {/* <Route element={<PrivateRoute />}> */}
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
          {/* <Route path="/myWriteShort" element={<MyWriteShort />} /> */}
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
