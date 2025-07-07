import React, { useState, useEffect } from 'react'
import { XIcon, SearchIcon, UserIcon } from 'lucide-react'
import { useAxios } from '../../hooks/useAxios'

export default function MemberSearchModal({
    visible,
    selected,
    onClose,
    onConfirm,
}) {
    const [query, setQuery] = useState('')
    const [list, setList] = useState([])
    const [checked, setChecked] = useState([])

    const axios = useAxios()


    useEffect(() => {
        if (visible) {
            setChecked(selected ?? [])
            setQuery('')
            setList([])
        }
    }, [visible, selected])


    useEffect(() => {
        if (!visible) return

        const fetch = async () => {
            try {
                const res = await axios.get('/admin/alert/search', { params: { q: query } })
                setList(res.data)
            } catch {
                setList([])
            }
        }

        fetch()
    }, [visible, query, axios])

    const toggle = username => {
        setChecked(prev =>
            prev.includes(username)
                ? prev.filter(u => u !== username)
                : [...prev, username]
        )
    }

    if (!visible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">회원 검색</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* 검색 입력 */}
                <div className="flex items-center mb-4">
                    <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="아이디 또는 닉네임 검색"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#006989]"
                    />
                </div>

                {/* 결과 리스트 */}
                <div className="max-h-80 overflow-y-auto">
                    <ul>
                        {list.map(user => (
                            <li
                                key={user.username}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">{user.nickname}</span>
                                    <span className="text-sm text-gray-400">({user.username})</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={checked.includes(user.username)}
                                    onChange={() => toggle(user.username)}
                                    className="form-checkbox text-[#006989] focus:ring-[#006989]"
                                />
                            </li>
                        ))}
                        {list.length === 0 && query && (
                            <li className="text-center py-4 text-gray-500">검색 결과가 없습니다.</li>
                        )}
                    </ul>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(checked)
                            onClose()
                        }}
                        className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78]"
                    >
                        선택 완료
                    </button>
                </div>
            </div>
        </div>
    )
}
