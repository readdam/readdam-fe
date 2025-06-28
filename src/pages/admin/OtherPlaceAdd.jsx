import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePrompt } from '@hooks/usePrompt';
import BasicInfoSection from '@components/admin/otherPlace/BasicInfoSection';
import DetailInfoSection from '@components/admin/otherPlace/DetailInfoSection';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { url } from '../../config/config';
import { tokenAtom } from '../../atoms';
import { useAtomValue } from 'jotai';

export default function OtherPlaceAdd() {
  const [form, setForm] = useState({
    name: '',
    basicAddress: '',
    detailAddress: '',
    phone: '',
    domain: '',
    weekdayStime: '',
    weekdayEtime: '',
    weekendStime: '',
    weekendEtime: '',
    introduce: '',
    fee: '',
    usageGuide: '',
    facilityGuide: '',
    caution: '',
    keywords: [],
    images: [],
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  // const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);

  // usePrompt('이 페이지를 벗어나시겠습니까?', isFormDirty);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // setIsFormDirty(true);
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && newKeyword.trim()) {
      e.preventDefault();
      setForm((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 5 - form.images.length);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    const readers = newImages.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setImagePreviews((prev) => [...prev, ...images].slice(0, 5));
    });
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    const requiredFields = [
      { key: 'name', label: '장소명' },
      { key: 'basicAddress', label: '기본주소' },
      { key: 'detailAddress', label: '상세주소' },
      { key: 'phone', label: '전화번호' },
      { key: 'domain', label: '홈페이지' },
      { key: 'weekdayStime', label: '평일 시작시간' },
      { key: 'weekdayEtime', label: '평일 종료시간' },
      { key: 'weekendStime', label: '주말 시작시간' },
      { key: 'weekendEtime', label: '주말 종료시간' },
      { key: 'introduce', label: '공간 소개' },
      { key: 'fee', label: '이용 요금' },
      { key: 'usageGuide', label: '사용 안내' },
      { key: 'facilities', label: '시설 안내' },
      { key: 'caution', label: '유의사항' },
    ];

    for (const field of requiredFields) {
      if (!form[field.key] || form[field.key].toString().trim() === '') {
        alert(`${field.label}을(를) 입력해주세요.`);
        return;
      }
    }

    if (form.lat === undefined || form.lng === undefined) {
      alert('위치(좌표)를 선택해주세요.');
      return;
    }

    if (!form.keywords || form.keywords.length === 0) {
      alert('키워드를 하나 이상 입력해주세요.');
      return;
    }

    if (!form.images || form.images.length === 0) {
      alert('이미지를 한 장 이상 첨부해주세요.');
      return;
    }

    const formData = new FormData();
    const toHHMMSS = (str) => (str ? str + ':00' : null);

    // 1. placeDto JSON 직렬화해서 넣기
    const placeDto = {
      name: form.name,
      phone: form.phone,
      domain: form.domain,
      fee: parseInt(form.price) || 0,
      facilities: form.facilityGuide,
      introduce: form.introduce,
      lat: form.lat,
      lng: form.lng,
      weekdayStime: toHHMMSS(form.weekdayStime),
      weekdayEtime: toHHMMSS(form.weekdayEtime),
      weekendStime: toHHMMSS(form.weekendStime),
      weekendEtime: toHHMMSS(form.weekendEtime),
      basicAddress: form.basicAddress,
      detailAddress: form.detailAddress, // 필요시 detailAddress도 검증에 포함
      caution: form.caution,
    };

    formData.append(
      'placeDto',
      new Blob([JSON.stringify(placeDto)], {
        type: 'application/json',
      })
    );

    // 2. 이미지들
    form.images.forEach((file) => {
      formData.append('images', file);
    });

    // 3. 키워드
    formData.append(
      'keywords',
      new Blob([JSON.stringify(form.keywords)], { type: 'application/json' })
    );

    try {
      const res = await axios.post(`${url}/admin/otherPlaceAdd`, formData, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      console.log(res);
      alert('저장 완료!');
      navigate('/admin/otherPlaceList');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft
            className="w-6 h-6"
            onClick={() => navigate('/admin/otherPlaceList')}
          />
        </button>
        <h1 className="text-2xl font-bold">외부 장소 추가</h1>
      </div>
      <div className="space-y-8">
        <BasicInfoSection form={form} onChange={handleInputChange} />
        <DetailInfoSection
          form={form}
          newKeyword={newKeyword}
          setNewKeyword={setNewKeyword}
          onChange={handleInputChange}
          onAddKeyword={handleAddKeyword}
          onRemoveKeyword={handleRemoveKeyword}
          imagePreviews={imagePreviews}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-[#006989] text-white px-6 py-3 rounded-lg"
            onClick={handleSubmit}
          >
            저장하기
          </button>
          <button
            type="button"
            className="flex-1 border px-6 py-3 rounded-lg"
            onClick={() => navigate('/admin/otherPlaceList')}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
