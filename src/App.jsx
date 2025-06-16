import './index.css';
import { Routes, Route } from 'react-router-dom';
import PlaceList from '@pages/admin/PlaceList';
import AdminRoutes from '@routes/AdminRoutes';
import PlaceAdd from '@pages/admin/PlaceAdd';
import UserRoutes from '@routes/UserRoutes';
import PlaceDetail from '@pages/user/PlaceDetail';
import Join from '@pages/user/Join';
import AdminInquiryList from '@pages/admin/AdminInquiryList';
import AdminUserList from '@pages/admin/AdminUserList';
import AdminUserDeletedList from '@pages/admin/AdminUserDeletedList';
import AdminNotice from '@pages/admin/AdminNotice';
import AdminPointStats from '@pages/admin/AdminPointStats';
import AdminEventReg from '@pages/admin/AdminEventReg';
import AdminEventJoinedList from '@pages/admin/AdminEventJoinedList';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AdminRoutes />}>
          <Route path="/adminUserList" element={<AdminUserList />} />
          <Route path="/adminUserDeletedList" element={<AdminUserDeletedList />} />
          <Route path="/placeList" element={<PlaceList />} />
          <Route path="/placeAdd" element={<PlaceAdd />} />
          <Route path='/adminInquiryList' element={<AdminInquiryList />}/>
          <Route path='/adminNotice' element={<AdminNotice />}/>
          <Route path='/adminEventReg' element={<AdminEventReg />}/>
          <Route path='/adminEventJoinedList' element={<AdminEventJoinedList />}/>
          <Route path='/adminPointStats' element={<AdminPointStats />}/>

        </Route>
      </Routes>
      <Routes>
        <Route element={<UserRoutes />}>
          <Route path="/join" element={<Join />} />
          <Route path="/placeDetail" element={<PlaceDetail />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
