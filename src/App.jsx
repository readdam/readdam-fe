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

function App() {
  return (
    <>
      <Routes>
        <Route path="/token" element={<Token />} />
        <Route element={<AdminRoutes />}>
          <Route path="/adminUserList" element={<AdminUserList />} />
          <Route path="/adminUserDeletedList" element={<AdminUserDeletedList />} />
          <Route path="/adminClassList" element={<AdminClassList />} />
          <Route path="/adminClassDetail" element={<AdminClassDetail />} />
          <Route path="/placeList" element={<PlaceList />} />
          <Route path="/placeAdd" element={<PlaceAdd />} />
        </Route>

        <Route element={<UserRoutes />}>
          <Route path="/join" element={<Join />} />
          <Route path="/placeDetail" element={<PlaceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-redirect" element={<OAuthRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/writeList" element={<WriteList />} />
          <Route path="/writeShortList" element={<WriteShortList />} />
          <Route path="/place" element={<Place />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/bookSearch" element={<BookSearch />} />
          <Route path="/bookDetail" element={<BookDetail />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/writeDetail" element={<WriteDetail />} />
          <Route path="/writeCreate" element={<WriteCreate />} />
          <Route path="/writeModify" element={<WriteModify />} />
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
          <Route path="/myClassIMade" element={<MyClassIMade />} />
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
        </Route>

      </Routes>
    </>
  );
}


export default App;
