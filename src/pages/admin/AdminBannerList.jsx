import React, { useState, useEffect } from 'react'
import { useAxios } from '../../hooks/useAxios'
import { url } from '../../config/config'
import dayjs from 'dayjs';
import {
  HomeIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
  ImageIcon,
  GripVerticalIcon,
} from 'lucide-react'

const AdminBannerList = () => {
  const axios = useAxios()
  const [banners, setBanners] = useState([])
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false)
  const [showDetailPopup, setShowDetailPopup] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [draggedBanner, setDraggedBanner] = useState(null)

  const [bannerForm, setBannerForm] = useState({
    title: '',
    status: 'visible',
    imageUrl: '',
    titleText: '',
    content: '',
    colors: {
      background: '#F3F7EC',
      text: '#333333',
    },
    buttons: {
      button1: { show: false, text: '', link: '', color: '#006989' },
      button2: { show: false, text: '', link: '', color: '#E88D67' },
    },
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const mainBanner = banners.find(b => b.isShow)

  const handleHideBanner = async (bannerId) => {
    try {
      // 드롭과 마찬가지로 FormData 만들어서 PUT 호출
      const banner = banners.find(b => b.bannerId === bannerId);
      if (!banner) {
        alert('배너를 찾을 수 없습니다.');
        return;
      }

      const fileName = new URLSearchParams(
        (banner.imageUrl || '').split('?')[1] || ''
      ).get('filename') || '';

      const formData = new FormData();
      formData.append('title', banner.title || '');
      formData.append('titleText', banner.titleText || '');
      formData.append('content', banner.content || '');
      formData.append('isShow', 'false');
      formData.append('btn1Name', banner.button1?.text || '');
      formData.append('btn1Link', banner.button1?.link || '');
      formData.append('btn1IsShow', banner.button1?.show ? 'true' : 'false');
      formData.append('btn2Name', banner.button2?.text || '');
      formData.append('btn2Link', banner.button2?.link || '');
      formData.append('btn2IsShow', banner.button2?.show ? 'true' : 'false');
      formData.append('img', fileName);

      await axios.put(`/admin/banner/${bannerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('메인 노출이 해제되었습니다.');
      fetchBanners();

    } catch (e) {
      console.error(e);
      alert('메인 배너 해제 실패');
    }
  }

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/admin/banner')
      const list = Array.isArray(res.data) ? res.data : []
      const mapped = list.map(b => ({
        ...b,
        button1: {
          show: b.button1?.show || false,
          text: b.button1?.text || '',
          link: b.button1?.link || '',
          color: '#006989',
        },
        button2: {
          show: b.button2?.show || false,
          text: b.button2?.text || '',
          link: b.button2?.link || '',
          color: '#E88D67',
        },
        status: b.isShow ? 'visible' : 'hidden',
        imageUrl: b.img
          ? `${url}/image?filename=${encodeURIComponent(b.img)}`
          : '',
      }))
      setBanners(mapped)
    } catch (error) {
      console.error('배너 조회 실패', error)
      alert('배너 목록 조회 실패')
    } finally {
      setLoading(false)
    }
  }

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      status: 'visible',
      imageUrl: '',
      titleText: '',
      content: '',
      colors: {
        background: '#F3F7EC',
        text: '#333333',
      },
      buttons: {
        button1: { show: false, text: '', link: '', color: '#006989' },
        button2: { show: false, text: '', link: '', color: '#E88D67' },
      },
    })
    setUploadedFileName(null)
    setUploadedFile(null)
    setSelectedBanner(null)
  }

  const handleOpenRegistrationForm = () => {
    resetBannerForm()
    setShowRegistrationPopup(true)
  }

  const handleViewBanner = (banner) => {
    setSelectedBanner(banner)
    setBannerForm({
      title: banner.title || '',
      status: banner.isShow ? 'visible' : 'hidden',
      imageUrl: banner.imageUrl || '',
      titleText: banner.titleText || '',
      content: banner.content || '',
      colors: banner.colors || {
        background: '#F3F7EC',
        text: '#333333',
      },
      buttons: {
        button1: {
          show: banner.button1?.show || false,
          text: banner.button1?.text || '',
          link: banner.button1?.link || '',
          color: '#006989',
        },
        button2: {
          show: banner.button2?.show || false,
          text: banner.button2?.text || '',
          link: banner.button2?.link || '',
          color: '#E88D67',
        },
      },
    })
    setShowDetailPopup(true)
    setUploadedFileName(null)
    setUploadedFile(null)
  }

  const handleFormChange = (field, value) => {
    setBannerForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleButtonChange = (btnNum, field, value) => {
    setBannerForm((prev) => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [`button${btnNum}`]: {
          ...prev.buttons[`button${btnNum}`],
          [field]: value,
        },
      },
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      handleFormChange('imageUrl', url)
      setUploadedFileName(file.name)
      setUploadedFile(file)
    }
  }

  const handleSaveBanner = async () => {

    if (!uploadedFile && !bannerForm.imageUrl) {
      alert('이미지를 선택해주세요.');
      return;
    }

    try {
      const formData = new FormData()
      formData.append('title', bannerForm.title || '')
      formData.append('titleText', bannerForm.titleText || '')
      formData.append('content', bannerForm.content || '')
      formData.append('isShow', bannerForm.status === 'visible' ? 'true' : 'false')
      formData.append('btn1Name', bannerForm.buttons.button1.text || '')
      formData.append('btn1Link', bannerForm.buttons.button1.link || '')
      formData.append('btn1IsShow', bannerForm.buttons.button1.show ? 'true' : 'false')
      formData.append('btn2Name', bannerForm.buttons.button2.text || '')
      formData.append('btn2Link', bannerForm.buttons.button2.link || '')
      formData.append('btn2IsShow', bannerForm.buttons.button2.show ? 'true' : 'false')

      if (uploadedFile) {
        formData.append('ifile', uploadedFile)
        formData.append('img', uploadedFile.name)
      } else if (bannerForm.imageUrl) {
        const fileName = new URLSearchParams(
          bannerForm.imageUrl.split('?')[1] || ''
        ).get('filename') || ''
        formData.append('img', fileName)
      } else {
        formData.append('img', '')
      }

      if (selectedBanner) {
        await axios.put(`/admin/banner/${selectedBanner.bannerId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('수정 완료')
      } else {
        await axios.post('/admin/banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        alert('등록 완료')
      }

      setShowRegistrationPopup(false)
      setShowDetailPopup(false)
      fetchBanners()
    } catch (e) {
      console.error(e)
      alert('저장 실패')
    }
  }

  const handleDragStart = (banner) => {
    setDraggedBanner(banner)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move";
  }

  const handleDrop = async (e, targetArea) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("bannerId");
    const draggedBanner = banners.find(b => b.bannerId === parseInt(draggedId, 10));

    if (!draggedBanner) {
      alert("드래그된 배너를 찾을 수 없습니다.");
      return;
    }

    try {
      // 기존 메인 배너 해제 필요
      if (mainBanner && mainBanner.bannerId !== draggedBanner.bannerId) {
        const fileNameOld = new URLSearchParams(
          (mainBanner.imageUrl || '').split('?')[1] || ''
        ).get('filename') || '';

        const formDataOld = new FormData();
        formDataOld.append('title', mainBanner.title || '');
        formDataOld.append('titleText', mainBanner.titleText || '');
        formDataOld.append('content', mainBanner.content || '');
        formDataOld.append('isShow', 'false');
        formDataOld.append('btn1Name', mainBanner.button1?.text || '');
        formDataOld.append('btn1Link', mainBanner.button1?.link || '');
        formDataOld.append('btn1IsShow', mainBanner.button1?.show ? 'true' : 'false');
        formDataOld.append('btn2Name', mainBanner.button2?.text || '');
        formDataOld.append('btn2Link', mainBanner.button2?.link || '');
        formDataOld.append('btn2IsShow', mainBanner.button2?.show ? 'true' : 'false');
        formDataOld.append('img', mainBanner.img || fileNameOld || '');

        await axios.put(`/admin/banner/${mainBanner.bannerId}`, formDataOld, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      await axios.put(`/admin/banner/current/${draggedId}`);
      alert('메인 배너가 변경되었습니다.');
      fetchBanners();
    } catch (e) {
      console.error(e);
      alert('배너 업데이트 실패');
    }
  };


  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    try {
      await axios.delete(`/admin/banner/${bannerId}`)
      fetchBanners()
    } catch (error) {
      console.error(error)
      alert('삭제 실패')
    }
  }

  const renderBannerPopup = () => {
    const isEdit = !!selectedBanner;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <h3 className="text-lg font-bold text-gray-800">
              {isEdit ? '배너 수정' : '새 배너 등록'}
            </h3>
            <button
              onClick={() => {
                setShowRegistrationPopup(false);
                setShowDetailPopup(false);
                setSelectedBanner(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* 관리자용 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                관리자용 제목
              </label>
              <input
                type="text"
                value={bannerForm.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#006989]"
                placeholder="배너 제목"
              />
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이미지 업로드
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  <span>파일 선택</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {uploadedFileName && (
                  <span className="text-sm text-gray-600">
                    {uploadedFileName}
                  </span>
                )}
                {bannerForm.imageUrl && !uploadedFileName && (
                  <span className="text-sm text-gray-600">
                    {new URLSearchParams(
                      bannerForm.imageUrl?.split('?')[1] || ''
                    ).get('filename') || ''}
                  </span>
                )}
              </div>
            </div>

            {/* 타이틀 텍스트 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                타이틀 텍스트
              </label>
              <input
                type="text"
                value={bannerForm.titleText}
                onChange={(e) => handleFormChange('titleText', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#006989]"
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                내용
              </label>
              <textarea
                rows={3}
                value={bannerForm.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-[#006989]"
              ></textarea>
            </div>

            {/* 버튼 설정 */}
            {[1, 2].map((btnNum) => (
              <div key={btnNum} className="border-t border-gray-300 pt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={bannerForm.buttons[`button${btnNum}`]?.show || false}
                    onChange={(e) =>
                      handleButtonChange(btnNum, 'show', e.target.checked)
                    }
                    className="mr-2 w-4 h-4 text-[#006989] border-gray-300 rounded focus:ring-[#006989]"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    버튼 {btnNum} 노출
                  </span>
                </div>
                {bannerForm.buttons[`button${btnNum}`]?.show && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        버튼명
                      </label>
                      <input
                        type="text"
                        value={bannerForm.buttons[`button${btnNum}`]?.text || ''}
                        onChange={(e) =>
                          handleButtonChange(btnNum, 'text', e.target.value)
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#006989]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        링크
                      </label>
                      <input
                        type="text"
                        value={bannerForm.buttons[`button${btnNum}`]?.link || ''}
                        onChange={(e) =>
                          handleButtonChange(btnNum, 'link', e.target.value)
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-[#006989]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 미리보기 */}
          <div className="border-t border-gray-300 pt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3">
              배너 미리보기
            </h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div
                className="flex flex-col md:flex-row"
                style={{
                  backgroundColor:
                    bannerForm.colors?.background || '#F3F7EC',
                  color: bannerForm.colors?.text || '#333333',
                }}
              >
                {/* Left: Text */}
                <div className="md:w-1/2 p-6">
                  <h3 className="text-lg font-bold mb-2">
                    {bannerForm.titleText || '배너 제목'}
                  </h3>
                  <p className="text-sm mb-4">
                    {bannerForm.content || '배너 내용이 여기에 표시됩니다.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2].map((btnNum) => {
                      const btn = bannerForm.buttons[`button${btnNum}`];
                      return (
                        btn?.show && (
                          <button
                            key={btnNum}
                            style={{
                              backgroundColor: btn.color,
                              color: '#fff',
                            }}
                            className="px-3 py-1 rounded text-sm"
                          >
                            {btn.text || `버튼 ${btnNum}`}
                          </button>
                        )
                      );
                    })}
                  </div>
                </div>

                {/* Right: Image */}
                <div className="md:w-1/2 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-300 p-6">
                  {bannerForm.imageUrl ? (
                    <img
                      src={bannerForm.imageUrl}
                      alt="미리보기"
                      className="w-full h-48 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-gray-300 bg-gray-50">
            <button
              onClick={handleSaveBanner}
              className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <HomeIcon className="w-4 h-4" />
            <span>배너</span>
          </div>
          <button
            onClick={handleOpenRegistrationForm}
            className="flex items-center px-3 py-2 bg-[#006989] text-white rounded"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            등록하기
          </button>
        </div>

        { /* 메인 배너 */}
        <div className="bg-white rounded-lg shadow mb-10 p-1">  
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold mb-2">메인 페이지 노출 배너</h2>
            <p className="text-sm text-gray-600">
              메인에 노출할 배너는 1개만 등록할 수 있습니다.
            </p>
          </div>
          <div
            className="flex items-center justify-center min-h-[80px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg m-4 text-gray-400"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'active')}
          >
            {mainBanner ? (
              <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                <div className="flex-1 truncate">
                  <span className="text-[#006989] font-semibold">
                    {mainBanner.title}
                  </span>
                </div>
                <button
                  onClick={() => handleHideBanner(mainBanner.bannerId)}
                  className="text-gray-500 hover:text-red-500"
                  title="메인 노출 해제"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                미설정 시, 메인에 읽담 기본 배너가 노출됩니다.
              </div>
            )}
          </div>
        </div>

        {/* 배너 리스트 테이블 */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">
                    {/* Grip Icon */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                    최종 수정일
                  </th>
                  <th className="px-6 py-3 text-center text-xs text-gray-500 uppercase">
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      로딩중...
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      등록된 배너가 없습니다.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.bannerId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-gray-400 cursor-grab" draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("bannerId", String(banner.bannerId));
                        }}
                      >
                        <GripVerticalIcon className="w-4 h-4" />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {banner.bannerId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="text-[#006989] hover:underline"
                          onClick={() => handleViewBanner(banner)}
                        >
                          {banner.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {dayjs(banner.updDate).format('YYYY.MM.DD A h:mm')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBanner(banner.bannerId);
                          }}
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

       
      </div>
      {(showRegistrationPopup || showDetailPopup) && renderBannerPopup()}
    </div>
  );
};

export default AdminBannerList
