import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import BasicInfoSection from '@components/admin/otherPlace/BasicInfoSection';
import DetailInfoSection from '@components/admin/otherPlace/DetailInfoSection';
import { ArrowLeft } from 'lucide-react';
import { url } from '@config/config';
import { useAxios } from '@hooks/useAxios';

export default function OtherPlaceEdit() {
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
    facilities: '',
    caution: '',
    keywords: [],
    images: [],
    lat: null,
    lng: null,
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const { placeId } = useParams();
  const axios = useAxios();

  function dataURLtoFile(dataurl, filename) {
    if (!dataurl || typeof dataurl !== 'string') return null;
    if (!dataurl.startsWith('data:image/')) return null;

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  // 데이터 불러오기
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`/admin/otherPlace/${placeId}`);
        const data = res.data;
        console.log(data);

        setForm({
          name: data.name || '',
          basicAddress: data.basicAddress || '',
          detailAddress: data.detailAddress || '',
          phone: data.phone || '',
          domain: data.domain || '',
          weekdayStime: data.weekdayStime?.slice(0, 5) || '',
          weekdayEtime: data.weekdayEtime?.slice(0, 5) || '',
          weekendStime: data.weekendStime?.slice(0, 5) || '',
          weekendEtime: data.weekendEtime?.slice(0, 5) || '',
          introduce: data.introduce || '',
          fee: data.fee || '',
          usageGuide: data.usageGuide || '',
          facilities: data.facilities || '',
          caution: data.caution || '',
          keywords: data.tags || [],
          images: [],
          lat: data.lat,
          lng: data.lng,
        });

        setImagePreviews(data.images || []);
      } catch (err) {
        console.error(err);
        alert('데이터를 불러오지 못했습니다.');
        navigate('/admin/otherPlaceList');
      }
    }

    fetchData();
  }, [placeId, navigate]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    const allowedCount = 5 - imagePreviews.length;
    const filesToAdd = files.slice(0, allowedCount);

    const readers = filesToAdd.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      setImagePreviews((prev) => [...prev, ...results]);

      // 반드시 preview 처리 끝나고 나서 form.images 갱신
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...filesToAdd],
      }));
    });
  };

  const handleRemoveImage = (index) => {
    const preview = imagePreviews[index];
    const isNew = preview.startsWith('data:');

    if (isNew) {
      // 새로 업로드한 이미지라면 form.images에서도 같이 제거
      const newImageCount = form.images.length;
      const newImageIndex = index - (imagePreviews.length - newImageCount);

      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== newImageIndex),
      }));
    }

    // 프리뷰에서 제거
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const toHHMMSS = (str) => (str ? str + ':00' : null);

    const placeDto = {
      name: form.name,
      phone: form.phone,
      domain: form.domain,
      introduce: form.introduce,
      lat: form.lat,
      lng: form.lng,
      weekdayStime: toHHMMSS(form.weekdayStime),
      weekdayEtime: toHHMMSS(form.weekdayEtime),
      weekendStime: toHHMMSS(form.weekendStime),
      weekendEtime: toHHMMSS(form.weekendEtime),
      basicAddress: form.basicAddress,
      detailAddress: form.detailAddress,
      fee: form.fee,
      usageGuide: form.usageGuide,
      facilities: form.facilities,
      caution: form.caution,
    };

    formData.append(
      'placeDto',
      new Blob([JSON.stringify(placeDto)], { type: 'application/json' })
    );

    // 신규 이미지
    imagePreviews.forEach((img, i) => {
      if (typeof img === 'string' && img.startsWith('data:image/')) {
        const file = dataURLtoFile(img, `otherPlace_${i}.jpg`);
        if (file) formData.append('placeImages', file);
      }
    });

    // 기존 이미지
    const existingImages = imagePreviews.filter(
      (img) => typeof img === 'string' && !img.startsWith('data:image/')
    );
    formData.append(
      'existingImages',
      new Blob([JSON.stringify(existingImages)], {
        type: 'application/json',
      })
    );

    // keywords
    formData.append(
      'keywords',
      new Blob([JSON.stringify(form.keywords)], { type: 'application/json' })
    );

    try {
      const res = await axios.post(
        `${url}/admin/otherPlaceEdit/${placeId}`,
        formData
      );
      console.log(res);
      alert('수정 완료!');
      navigate('/admin/otherPlaceList');
    } catch (err) {
      console.error(err);
      alert('수정 실패');
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
        <h1 className="text-2xl font-bold">외부 장소 수정</h1>
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
          setImagePreviews={setImagePreviews}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-[#006989] text-white px-6 py-3 rounded-lg"
            onClick={handleSubmit}
          >
            수정하기
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
