import React, { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import { useAxios } from "@hooks/useAxios";
import { url } from "../../config/config";
import AddrSearchModal from "@components/class/AddrSearchModal";
import ReservationSelectModal from "@components/class/ReservationSelectModal";
import {
  CalendarIcon,
  ImageIcon,
  MapPinIcon,
  SearchIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassCreate = () => {
  const axios = useAxios();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    tags: [],
    minParticipants: "",
    maxParticipants: "",
    sessionCount: 3,
    venue: "외부",
    venueName: "",
    venueAddress: "",
    lat: 0,
    log: 0,
    dates: [],
    sessionDetails: Array(3).fill({
      description: "",
    }),
    description: "",
    leaderDescription: "",
  });

  const [reservationIds, setReservationIds] = useState([]);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlaceSelect = (place) => {
    setForm((prev) => ({
      ...prev,
      venueAddress: place.address_name,
      lat: place.y,
      log: place.x,
    }));
  };

  // 이미지(미리보기용 포함)
  const [mainImgF, setMainImgF] = useState("");
  const [mainImgFPreview, setMainImgFPreview] = useState("");

  const [leaderImgF, setLeaderImgF] = useState("");
  const [leaderImgFPreview, setLeaderImgFPreview] = useState("");

  const [roundImgs, setRoundImgs] = useState({
    round1ImgF: "",
    round1BookimgF: "",
    round2ImgF: "",
    round2BookimgF: "",
    round3ImgF: "",
    round3BookimgF: "",
    round4ImgF: "",
    round4BookimgF: "",
  });

  const [roundImgPreviews, setRoundImgPreviews] = useState({});

  const handleRoundImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setRoundImgs((prev) => ({
        ...prev,
        [field]: file,
      }));
      setRoundImgPreviews((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file),
      }));
    }
  };

  const removeRoundImgF = (e) => {
    e.preventDefault();
    setRoundImgs("");
    setRoundImgPreviews("");
  };

  const handleMainImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImgF(file);
      setMainImgFPreview(URL.createObjectURL(file));
    }
  };

  const removeMainImgF = (e) => {
    e.preventDefault();
    setMainImgF("");
    setMainImgFPreview("");
  };

  const handleLeaderImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLeaderImgF(file);
      setLeaderImgFPreview(URL.createObjectURL(file));
    }
  };

  const removeLeaderImgF = (e) => {
    e.preventDefault();
    setLeaderImgF("");
    setLeaderImgFPreview("");
  };

  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Form submitted:", form);
    const submitData = new FormData();
    submitData.append("title", form.title);
    submitData.append("shortIntro", form.shortDescription);
    submitData.append("minPerson", String(form.minParticipants ?? ""));
    submitData.append("maxPerson", String(form.maxParticipants ?? ""));
    submitData.append("classIntro", form.description);
    submitData.append("leaderIntro", form.leaderDescription);
    submitData.append("leaderUsername", user.username);
    submitData.append("isReaddam", form.venue === "읽담" ? "0" : "1");

    //태그 파싱
    const tagArray = form.tags.map((tag) => tag.trim()).filter((tag) => tag); // 공백 제거 + 빈 문자열 제거
    submitData.append("tag1", tagArray[0] || "");
    submitData.append("tag2", tagArray[1] || "");
    submitData.append("tag3", tagArray[2] || "");

    // 이미지 append
    // 대표 이미지
    if (mainImgF) {
      submitData.append("mainImgF", mainImgF);
      submitData.append("mainImg", mainImgF.name);
    }
    // 리더 이미지
    if (leaderImgF) {
      submitData.append("leaderImgF", leaderImgF);
      submitData.append("leaderImg", leaderImgF.name);
    }

    reservationIds
  .filter(id => id != null && !isNaN(id)) 
  .forEach(id => {
    submitData.append("reservationId", id);
  });
  console.log("▶️ reservationIds state:", reservationIds);
  for (let [key, value] of submitData.entries()) {
  console.log(`▶️ FormData ${key}:`, value);
}
    // 회차 이미지들
    Object.entries(roundImgs).forEach(([key, file]) => {
      if (file) {
        submitData.append(key, file);
        const nameKey = key.replace("ImgF", "Img");
        submitData.append(nameKey, file.name);
      }
    });

    // === 회차별 공통 필드 ===
    const sessionCount = form.sessionCount;

    for (let i = 0; i < sessionCount; i++) {
      const round = i + 1; // 1-based
      const date = form.dates[i] || ""; // YYYY-MM-DD
      const dateOnly = date || "";

      if (dateOnly) submitData.append(`round${round}Date`, dateOnly);
      submitData.append(`round${round}PlaceName`, form.venueName || "");
      submitData.append(`round${round}PlaceLoc`, form.venueAddress || "");
      submitData.append(
        `round${round}Content`,
        form.sessionDetails[i]?.description || ""
      );
      submitData.append(`round${round}Bookname`, ""); // 책 제목 (추후 구현)
      submitData.append(`round${round}Bookwriter`, ""); // 책 저자
      submitData.append(`round${round}Lat`, form.lat ?? "0"); // 위도
      submitData.append(`round${round}Log`, form.log ?? "0"); // 경도
    }

    // submitData 전송 확인 로그
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // 데이터 전송(axios)
    console.log(token);
    console.log("axios 전송 시작");
    axios
      .post(`${url}/my/createClass`, submitData, {
        headers: {
          Authorization: token.access_token,
        },
      })
      .then((res) => {
        console.log(res);
        navigate(`/classDetail/${res.data.classId}`);
      })
      .catch((err) => {
        console.log("axios에러 발생:", err);
      });
  };

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleTagToggle = (tag) => {
    if (form.tags.includes(tag)) {
      setForm({
        ...form,
        tags: form.tags.filter((t) => t !== tag),
      });
    } else if (form.tags.length < 3) {
      setForm({
        ...form,
        tags: [...form.tags, tag],
      });
    }
  };

  // 모임회차 선택(3회, 4회)에 따라 회차별 진행 상세내용 입력
  const handleSessionCountChange = (count) => {
    setForm({
      ...form,
      sessionCount: count,
      sessionDetails: Array(count).fill({
        description: "",
      }),
      dates: [],
    });
  };

  // 예약한 읽담장소 불러오기 관련 상태
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationList, setReservationList] = useState([]);

  // 예약 모달에서 선택 시 호출될 핸들러
  const handleReservationApply = (selected) => {
    if (
      !selected ||
      !Array.isArray(selected.dates) ||
      selected.dates.length === 0
    ) {
      alert("유효한 예약 정보가 아닙니다.");
      return;
    }

    const sessionCount = selected.dates.length;

    // 날짜가 빠졌거나 값이 이상하면 경고
    const isValidDates = selected.dates.every(
      (date) => typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)
    );
    if (!isValidDates) {
      alert("잘못된 날짜 형식입니다.");
      return;
    }

    // venue 정보 필수 항목 확인
    if (
      !selected.venueName ||
      !selected.venueAddress ||
      !selected.lat ||
      !selected.log
    ) {
      alert("장소 정보가 누락되었습니다.");
      return;
    }

    // form 상태 업데이트
    setForm((prev) => ({
      ...prev,
      venue: "읽담", // 예약 기반이므로 자동 설정
      sessionCount: sessionCount,
      dates: [...selected.dates], // 예약된 날짜로 복사
      sessionDetails: Array(sessionCount).fill({ description: "" }), // 회차수만큼 초기화
      venueName: selected.venueName,
      venueAddress: selected.venueAddress,
      lat: selected.lat,
      log: selected.log,
    }));

    // 모달 닫기
    setIsReservationModalOpen(false);
  };

  // 모임 회차별 북커버 이미지 불러오기
  // const [showBookModal, setShowBookModal] = useState(false);
  // const handleSearchCover = () => {
  //   setShowBookModal(true);
  // };
  // const handleSelectCover = (thumbnailUrl) => {
  //   setFormData({
  //     ...formData,
  //     image: thumbnailUrl,
  //   });
  //   // setIfile(null); // 기존 업로드 파일 제거
  //   setShowBookModal(false);
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          className="space-y-8"
        >
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              모임 만들기
            </h1>
            <p className="text-sm text-red-500 mb-6">
              * 표시된 항목은 필수 입력 사항입니다.
            </p>
            {/* 기본 정보 영역 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006989] focus:border-transparent"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="모임의 제목을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 한 줄 소개 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006989] focus:border-transparent"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="모임을 한 줄로 소개해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그 설정 <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  최대 3개 복수 선택 가능
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "모임 초보 환영",
                    "독서 습관 형성",
                    "독서 취향 공유",
                    "무거운 책 가볍게 얘기하기",
                    "가벼운 책 깊게 다루기",
                    "책 고수 환영",
                    "한 주제 X 여러 책",
                    "한 작품 X 여러 주제",
                    "발제 있어요",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        form.tags.includes(tag)
                          ? "bg-[#006989] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 모임 상세정보 영역 */}
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              모임 상세정보
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모집 인원 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={form.minParticipants}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      const adjustedmax =
                        form.maxParticipants < newMin
                          ? newMin
                          : form.maxParticipants;
                      setForm({
                        ...form,
                        minParticipants: newMin,
                        maxParticipants: adjustedmax,
                      });
                    }}
                  >
                    <option value="" disabled>
                      최소 인원 선택
                    </option>
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}명
                      </option>
                    ))}
                  </select>
                  <span>~</span>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxParticipants: parseInt(e.target.value),
                      })
                    }
                    disabled={!form.minParticipants} //비활성화 조건
                  >
                    <option value="" disabled>
                      최대 인원 선택
                    </option>
                    {[4, 5, 6, 7, 8, 9, 10]
                      .filter((num) => num >= form.minParticipants)
                      .map((num) => (
                        <option key={num} value={num}>
                          {num}명
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 회차 선택
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(3)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.sessionCount === 3
                        ? "bg-[#006989] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    3회차
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(4)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.sessionCount === 4
                        ? "bg-[#006989] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    4회차
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장소 선택
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.venue === "읽담"
                      ? "bg-[#006989] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={async () => {
                    try {
                      const res = await axios.get(
                        `${url}/my/placeReservationInfo`,
                        {
                          headers: {
                            Authorization: token.access_token,
                          },
                        }
                      );
                      if (!Array.isArray(res.data) || res.data.length === 0) {
                        alert(
                          "읽담 예약 정보가 없습니다. 먼저 읽담 공간을 예약해주세요."
                        );
                        return;
                      }
                      console.log("✅ 예약 데이터:", res.data);
                      setReservationList(res.data);
                      setIsReservationModalOpen(true); // 모달 띄우기
                    } catch (err) {
                      console.error("읽담 예약 정보 불러오기 실패", err);
                      alert("예약 정보를 불러오지 못했습니다.");
                    }
                  }}
                >
                  읽담
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      venue: "외부",
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.venue === "외부"
                      ? "bg-[#006989] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  외부
                </button>
              </div>
              <div className="space-y-4">
                {form.venue === "읽담" ? (
                  <input
                    placeholder="장소 이름"
                    type="text"
                    value={form.venueName || ""}
                    readOnly
                  />
                ) : (
                  <input
                    type="text"
                    value={form.venueName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        venueName: e.target.value,
                      }))
                    }
                  />
                )}
                <div className="flex gap-2">
                  {form.venue === "읽담" ? (
                    <input
                      type="text"
                      placeholder="주소(외부 장소의 경우 검색버튼을 눌러주세요)"
                      value={form.venueAddress || ""}
                      readOnly
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder="주소(외부 장소의 경우 검색버튼을 눌러주세요)"
                      value={form.venueAddress}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          venueAddress: e.target.value,
                        }))
                      }
                      readOnly
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    disabled={form.venue === "읽담"}
                    className={`px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* '읽담' 예약내역 불러오는 모달 */}
              {isReservationModalOpen && (
                <ReservationSelectModal
                  reservations={reservationList}
                  sessionCount={form.sessionCount}
    onApply={(selected) => {
      const {
        dates,
        venueName,
        venueAddress,
        lat,
        log,
        reservationIds,    // ← 여기를 추가로 꺼내서
      } = selected;

      // 1) form 정보 업데이트
     setForm(prev => ({
        ...prev,
        venue: "읽담",
        venueName,
        venueAddress,
        lat,
        log,
        dates,
        sessionDetails: Array(dates.length).fill({ description: "" }),
      }));
      // 2) reservationIds state에 저장 (이 값이 handleSubmit 때 FormData에 붙임)
      setReservationIds(reservationIds);

      setIsReservationModalOpen(false);
    }}
                  onClose={() => setIsReservationModalOpen(false)}
                />
              )}

              {/* '외부' 장소(주소) 선택 창 */}
              {isModalOpen && (
                <AddrSearchModal
                  onSelect={handlePlaceSelect}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                모임 일정 선택
              </label>
              <div className="space-y-4">
                {Array.from({
                  length: form.sessionCount,
                }).map((_, index) => {
                  const prevDate = form.dates[index - 1];
                  const minDate = prevDate ? addDays(prevDate, 1) : undefined;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-20">
                        {index + 1}회차:
                      </span>
                      <input
                        type="date"
                        disabled={
                          form.venue === "읽담" ||
                          (index > 0 && !form.dates[index - 1])
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                        value={form.dates[index] || ""}
                        readOnly={form.venue === "읽담"}
                        min={minDate}
                        onChange={(e) => {
                          const newDates = [...form.dates];
                          newDates[index] = e.target.value;
                          setForm({
                            ...form,
                            dates: newDates,
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                회차별 진행 상세 내용
              </label>
              <div className="space-y-6">
                {Array.from({
                  length: form.sessionCount,
                }).map((_, index) => {
                  const roundField = `round${index + 1}ImgF`; // 고유 key
                  return (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        {index + 1}회차 진행 상세 내용
                      </h3>
                      <div className="flex gap-4 mb-4">
                        <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#006989] transition-colors">
                          {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                          {!roundImgPreviews[roundField] && (
                            <>
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <label className="text-sm text-gray-500">
                                이미지 업로드
                              </label>
                            </>
                          )}
                          {roundImgPreviews[roundField] && (
                            <div className="relative w-40 h-40 mt-2">
                              <img
                                src={roundImgPreviews[roundField]}
                                alt="미리보기"
                                className="w-36 h-36 object-cover rounded-md"
                              />
                              <button
                                onClick={removeRoundImgF}
                                className="absolute top-2 right-2 bg-white text-gray-600 border rounded-full p-1 hover:text-red-500"
                                type="button"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleRoundImageChange(e, roundField)
                            }
                            className="hidden"
                          />
                        </label>
                        <textarea
                          className="flex-1 p-4 border border-gray-300 rounded-lg resize-none h-32"
                          placeholder={`${
                            index + 1
                          }회차 진행 내용을 입력해주세요`}
                          value={form.sessionDetails[index]?.description || ""}
                          onChange={(e) => {
                            const newDetails = [...form.sessionDetails];
                            newDetails[index] = {
                              ...newDetails[index],
                              description: e.target.value,
                            };
                            setForm({
                              ...form,
                              sessionDetails: newDetails,
                            });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#E88D67] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        북커버 이미지 검색
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 추가 정보 영역 */}
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">추가 정보</h2>
            <div>
              <label
                htmlFor="mainImgUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                대표 이미지 <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="mainImgUpload"
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#006989] transition-colors"
              >
                {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                {!mainImgFPreview && (
                  <>
                    <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      모임의 대표 이미지를 업로드해주세요
                    </span>
                  </>
                )}
                {/* 이미지가 있을 때만 미리보기 표시 */}
                {mainImgFPreview && (
                  <div className="relative w-40 h-40 mt-2">
                    <img
                      src={mainImgFPreview}
                      alt="미리보기"
                      className="w-40 h-40 object-cover rounded-md"
                    />
                    <button
                      onClick={removeMainImgF}
                      className="absolute top-2 right-2 bg-white text-gray-600 border rounded-full p-1 hover:text-red-500"
                      type="button"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <input
                  id="mainImgUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImgChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모임 상세소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none"
                placeholder="모임에 대해 자세히 소개해주세요"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모임 리더 소개
              </label>
              <div className="flex gap-4">
                <label
                  htmlFor="leaderImgUpload"
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#006989] transition-colors"
                >
                  {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                  {!leaderImgFPreview && (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        이미지 업로드
                      </span>
                    </>
                  )}
                  {/* 이미지가 있을 때만 미리보기 표시 */}
                  {leaderImgFPreview && (
                    <div className="relative w-40 h-40">
                      <img
                        src={leaderImgFPreview}
                        alt="미리보기"
                        className="w-36 h-36 object-cover rounded-md"
                      />
                      <button
                        onClick={removeLeaderImgF}
                        className="absolute top-1 right-1 bg-white text-gray-600 border rounded-full p-1 hover:text-red-500"
                        type="button"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    id="leaderImgUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleLeaderImgChange}
                    className="hidden"
                  />
                </label>
                <textarea
                  className="flex-1 p-4 border border-gray-300 rounded-lg resize-none h-32"
                  placeholder="모임 리더님을 소개해주세요"
                  value={form.leaderDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leaderDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            {/* <button
              type="button"
              onClick={handleTempSave}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              수정
            </button> */}
            <button
              type="submit"
              className="px-8 py-3 bg-[#006989] text-white rounded-lg hover:bg-accent transition-colors"
            >
              등록
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
export default ClassCreate;
