import React, { useState } from 'react'
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  MessageSquareIcon,
  SettingsIcon,
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
  ImageIcon,
  PlusIcon,
  XIcon,
  UploadIcon,
  EyeIcon,
  EyeOffIcon,
  CheckSquareIcon,
} from 'lucide-react'

const AdminBannerList = () => {
  // 상태 관리
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false)
  const [showDetailPopup, setShowDetailPopup] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [activeMenu, setActiveMenu] = useState('배너 등록')
  // 더미 데이터
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: '겨울 독서 이벤트 배너',
      displayOrder: 1,
      status: 'visible',
      registrationDate: '2025-01-10',
      style: 'fullBackground',
      imageUrl:
        'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      link: '/events/winter-reading',
      rolling: true,
    },
    {
      id: 2,
      title: '신규 회원 가입 혜택 안내',
      displayOrder: 2,
      status: 'visible',
      registrationDate: '2025-01-05',
      style: 'internalComposition',
      imageUrl:
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      textTitle: '신규 회원 가입 혜택',
      content: '지금 회원 가입하면 3,000 포인트와 첨삭 쿠폰을 드립니다.',
      buttons: {
        button1: {
          show: true,
          text: '회원가입',
          link: '/signup',
          color: '#006989',
        },
        button2: {
          show: true,
          text: '자세히 보기',
          link: '/promotion/signup',
          color: '#E88D67',
        },
      },
      colors: {
        background: '#F3F7EC',
        text: '#333333',
      },
      rolling: true,
    },
  ])
  // 배너 등록 폼 상태
  const [bannerForm, setBannerForm] = useState({
    title: '',
    displayOrder: 1,
    status: 'visible',
    style: 'fullBackground',
    imageUrl: '',
    link: '',
    rolling: true,
    colors: {
      background: '#F3F7EC',
      text: '#333333',
    },
    buttons: {
      button1: {
        show: false,
        text: '',
        link: '',
        color: '#006989',
      },
      button2: {
        show: false,
        text: '',
        link: '',
        color: '#E88D67',
      },
    },
  })
  // 배너 상세 보기
  const handleViewBanner = (banner) => {
    setSelectedBanner(banner)
    setBannerForm(banner)
    setShowDetailPopup(true)
  }
  // 배너 등록 폼 초기화
  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      displayOrder: 1,
      status: 'visible',
      style: 'fullBackground',
      imageUrl: '',
      link: '',
      rolling: true,
      colors: {
        background: '#F3F7EC',
        text: '#333333',
      },
      buttons: {
        button1: {
          show: false,
          text: '',
          link: '',
          color: '#006989',
        },
        button2: {
          show: false,
          text: '',
          link: '',
          color: '#E88D67',
        },
      },
    })
  }
  // 배너 등록 폼 열기
  const handleOpenRegistrationForm = () => {
    resetBannerForm()
    setShowRegistrationPopup(true)
  }
  // 폼 필드 변경 핸들러
  const handleFormChange = (field, value) => {
    setBannerForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
  // 색상 필드 변경 핸들러
  const handleColorChange = (field, value) => {
    setBannerForm((prev) => ({
      ...prev,
      colors: {
        ...prev,
        [field]: value,
      },
    }))
  }
  // 버튼 필드 변경 핸들러
  const handleButtonChange = (buttonNum, field, value) => {
    setBannerForm((prev) => ({
      ...prev,
      buttons: {
        ...prev,
        [`button${buttonNum}`]: {
          ...prev,
          [field]: value,
        },
      },
    }))
  }
  // 배너 저장 핸들러
  const handleSaveBanner = () => {
    if (selectedBanner) {
      // 기존 배너 수정
      const updatedBanners = banners.map((banner) =>
        banner.id === selectedBanner.id
          ? ({
              ...bannerForm,
              id: banner.id,
            })
          : banner,
      )
      setBanners(updatedBanners)
    } else {
      // 새 배너 추가
      const newBanner = {
        ...bannerForm,
        id: banners.length > 0 ? Math.max(...banners.map((b) => b.id)) + 1 : 1,
        registrationDate: new Date().toISOString().split('T')[0],
      }
      setBanners([...banners, newBanner])
    }
    setShowRegistrationPopup(false)
    setShowDetailPopup(false)
    setSelectedBanner(null)
  }
  // 이미지 업로드 핸들러 (실제로는 파일 업로드 로직이 필요하지만, 여기서는 URL만 설정)
  const handleImageUpload = (e) => {
    // 실제 구현에서는 파일 업로드 API 호출 필요
    // 여기서는 예시로 가상의 URL 설정
    const file = e.target.files?.[0]
    if (file) {
      // 실제로는 서버에 업로드하고 URL을 받아와야 함
      const fakeImageUrl = URL.createObjectURL(file)
      handleFormChange('imageUrl', fakeImageUrl)
    }
  }
  // 배너 등록/수정 팝업
  const renderBannerPopup = () => {
    const isEdit = !!selectedBanner
    const popupTitle = isEdit ? '배너 상세/수정' : '새 배너 등록'
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-bold">{popupTitle}</h3>
            <button
              onClick={() => {
                setShowRegistrationPopup(false)
                setShowDetailPopup(false)
                setSelectedBanner(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="관리자 확인용 제목으로, 최대 50자까지 입력 가능합니다."
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  required
                />
              </div>
              {/* 배너 스타일 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배너 스타일 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bannerStyle"
                      checked={bannerForm.style === 'fullBackground'}
                      onChange={() =>
                        handleFormChange('style', 'fullBackground')
                      }
                      className="w-4 h-4 text-[#006989] border-gray-300 focus:ring-[#006989]"
                    />
                    <span className="ml-2">전체 배경형 (풀 이미지 배너)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bannerStyle"
                      checked={bannerForm.style === 'internalComposition'}
                      onChange={() =>
                        handleFormChange('style', 'internalComposition')
                      }
                      className="w-4 h-4 text-[#006989] border-gray-300 focus:ring-[#006989]"
                    />
                    <span className="ml-2">
                      내부 구성형 (텍스트와 이미지 분리 배치)
                    </span>
                  </label>
                </div>
              </div>
              {/* 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 업로드 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    <span>이미지 선택</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {bannerForm.imageUrl && (
                    <span className="text-sm text-gray-600">
                      {bannerForm.imageUrl.split('/').pop()}
                    </span>
                  )}
                </div>
                {bannerForm.imageUrl && (
                  <div className="mt-4 border rounded-lg p-2 max-w-md">
                    <p className="text-sm text-gray-500 mb-2">미리보기:</p>
                    <img
                      src={bannerForm.imageUrl}
                      alt="Banner preview"
                      className="w-full h-auto max-h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              {/* 노출 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  노출 상태
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="displayStatus"
                      checked={bannerForm.status === 'visible'}
                      onChange={() => handleFormChange('status', 'visible')}
                      className="w-4 h-4 text-[#006989] border-gray-300 focus:ring-[#006989]"
                    />
                    <span className="ml-2">노출함</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="displayStatus"
                      checked={bannerForm.status === 'hidden'}
                      onChange={() => handleFormChange('status', 'hidden')}
                      className="w-4 h-4 text-[#006989] border-gray-300 focus:ring-[#006989]"
                    />
                    <span className="ml-2">노출안함</span>
                  </label>
                </div>
              </div>
              {/* 노출 순서 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  노출 순서 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={bannerForm.displayOrder}
                  onChange={(e) =>
                    handleFormChange('displayOrder', parseInt(e.target.value))
                  }
                  min="1"
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  숫자가 작을수록 우선순위가 높습니다.
                </p>
              </div>
              {/* 롤링 여부 */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bannerForm.rolling}
                    onChange={(e) =>
                      handleFormChange('rolling', e.target.checked)
                    }
                    className="w-4 h-4 text-[#006989] border-gray-300 rounded focus:ring-[#006989]"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    롤링 배너에 포함
                  </span>
                </label>
              </div>
              {/* 스타일별 추가 필드 */}
              {bannerForm.style === 'fullBackground' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    링크 URL
                  </label>
                  <input
                    type="text"
                    value={bannerForm.link || ''}
                    onChange={(e) => handleFormChange('link', e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 텍스트 영역 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      타이틀 텍스트
                    </label>
                    <input
                      type="text"
                      value={bannerForm.textTitle || ''}
                      onChange={(e) =>
                        handleFormChange('textTitle', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                      placeholder="배너 제목을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      내용
                    </label>
                    <textarea
                      value={bannerForm.content || ''}
                      onChange={(e) =>
                        handleFormChange('content', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                      placeholder="배너 내용을 입력하세요"
                    />
                  </div>
                  {/* 버튼 설정 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">버튼 설정</h4>
                    {/* 버튼 1 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bannerForm.buttons?.button1?.show}
                            onChange={(e) =>
                              handleButtonChange(1, 'show', e.target.checked)
                            }
                            className="w-4 h-4 text-[#006989] border-gray-300 rounded focus:ring-[#006989]"
                          />
                          <span className="ml-2 text-sm font-medium">
                            버튼 1 노출
                          </span>
                        </label>
                      </div>
                      {bannerForm.buttons?.button1?.show && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              버튼명
                            </label>
                            <input
                              type="text"
                              value={bannerForm.buttons?.button1?.text || ''}
                              onChange={(e) =>
                                handleButtonChange(1, 'text', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                              placeholder="버튼 텍스트"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              링크
                            </label>
                            <input
                              type="text"
                              value={bannerForm.buttons?.button1?.link || ''}
                              onChange={(e) =>
                                handleButtonChange(1, 'link', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                              placeholder="https://"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              버튼 색상
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={
                                  bannerForm.buttons?.button1?.color ||
                                  '#006989'
                                }
                                onChange={(e) =>
                                  handleButtonChange(1, 'color', e.target.value)
                                }
                                className="w-8 h-8 rounded border"
                              />
                              <input
                                type="text"
                                value={
                                  bannerForm.buttons?.button1?.color ||
                                  '#006989'
                                }
                                onChange={(e) =>
                                  handleButtonChange(1, 'color', e.target.value)
                                }
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                                placeholder="#RRGGBB"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 버튼 2 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bannerForm.buttons?.button2?.show}
                            onChange={(e) =>
                              handleButtonChange(2, 'show', e.target.checked)
                            }
                            className="w-4 h-4 text-[#006989] border-gray-300 rounded focus:ring-[#006989]"
                          />
                          <span className="ml-2 text-sm font-medium">
                            버튼 2 노출
                          </span>
                        </label>
                      </div>
                      {bannerForm.buttons?.button2?.show && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              버튼명
                            </label>
                            <input
                              type="text"
                              value={bannerForm.buttons?.button2?.text || ''}
                              onChange={(e) =>
                                handleButtonChange(2, 'text', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                              placeholder="버튼 텍스트"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              링크
                            </label>
                            <input
                              type="text"
                              value={bannerForm.buttons?.button2?.link || ''}
                              onChange={(e) =>
                                handleButtonChange(2, 'link', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                              placeholder="https://"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              버튼 색상
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={
                                  bannerForm.buttons?.button2?.color ||
                                  '#E88D67'
                                }
                                onChange={(e) =>
                                  handleButtonChange(2, 'color', e.target.value)
                                }
                                className="w-8 h-8 rounded border"
                              />
                              <input
                                type="text"
                                value={
                                  bannerForm.buttons?.button2?.color ||
                                  '#E88D67'
                                }
                                onChange={(e) =>
                                  handleButtonChange(2, 'color', e.target.value)
                                }
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989] text-sm"
                                placeholder="#RRGGBB"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 색상 설정 */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">색상 설정</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          배경 색상
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={bannerForm.colors?.background || '#F3F7EC'}
                            onChange={(e) =>
                              handleColorChange('background', e.target.value)
                            }
                            className="w-10 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={bannerForm.colors?.background || '#F3F7EC'}
                            onChange={(e) =>
                              handleColorChange('background', e.target.value)
                            }
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                            placeholder="#RRGGBB"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          텍스트 색상
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={bannerForm.colors?.text || '#333333'}
                            onChange={(e) =>
                              handleColorChange('text', e.target.value)
                            }
                            className="w-10 h-10 rounded border"
                          />
                          <input
                            type="text"
                            value={bannerForm.colors?.text || '#333333'}
                            onChange={(e) =>
                              handleColorChange('text', e.target.value)
                            }
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#006989]"
                            placeholder="#RRGGBB"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 배너 미리보기 */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      배너 미리보기
                    </h4>
                    <div
                      className="border rounded-lg overflow-hidden"
                      style={{
                        backgroundColor:
                          bannerForm.colors?.background || '#F3F7EC',
                      }}
                    >
                      <div className="flex flex-col md:flex-row p-6">
                        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
                          <h3
                            className="text-2xl font-bold mb-2"
                            style={{
                              color: bannerForm.colors?.text || '#333333',
                            }}
                          >
                            {bannerForm.textTitle || '배너 제목'}
                          </h3>
                          <p
                            className="mb-4"
                            style={{
                              color: bannerForm.colors?.text || '#333333',
                            }}
                          >
                            {bannerForm.content ||
                              '배너 내용이 여기에 표시됩니다.'}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {bannerForm.buttons?.button1?.show && (
                              <button
                                style={{
                                  backgroundColor:
                                    bannerForm.buttons.button1.color ||
                                    '#006989',
                                  color: '#ffffff',
                                }}
                                className="px-4 py-2 rounded-lg"
                              >
                                {bannerForm.buttons.button1.text || '버튼 1'}
                              </button>
                            )}
                            {bannerForm.buttons?.button2?.show && (
                              <button
                                style={{
                                  backgroundColor:
                                    bannerForm.buttons.button2.color ||
                                    '#E88D67',
                                  color: '#ffffff',
                                }}
                                className="px-4 py-2 rounded-lg"
                              >
                                {bannerForm.buttons.button2.text || '버튼 2'}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="md:w-1/2">
                          {bannerForm.imageUrl ? (
                            <img
                              src={bannerForm.imageUrl}
                              alt="Banner preview"
                              className="w-full h-auto rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
            <button
              onClick={() => {
                setShowRegistrationPopup(false)
                setShowDetailPopup(false)
                setSelectedBanner(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg mr-2 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              onClick={handleSaveBanner}
              className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="flex">
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-6 max-w-[1440px]">
          {/* breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <HomeIcon className="w-4 h-4" />
            <span>배너</span>
          </div>
          {/* 검색 영역 */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">배너 관리</h2>
              <button
                onClick={handleOpenRegistrationForm}
                className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                등록하기
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              메인 페이지에 노출되는 배너를 관리할 수 있습니다.
            </p>
          </div>
          {/* 배너 목록 테이블 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    노출 순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    노출 상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.displayOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-[#006989] hover:underline"
                        onClick={() => handleViewBanner(banner)}
                      >
                        {banner.title}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${banner.status === 'visible' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {banner.status === 'visible' ? '노출' : '비노출'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.registrationDate}
                    </td>
                  </tr>
                ))}
                {banners.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      등록된 배너가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* 페이지네이션 */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                총 {banners.length}개의 배너가 있습니다.
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  이전
                </button>
                <button className="px-3 py-1 bg-black text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  다음
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* 배너 등록/수정 팝업 */}
      {(showRegistrationPopup || showDetailPopup) && renderBannerPopup()}
    </div>
  )
}
export default AdminBannerList;
