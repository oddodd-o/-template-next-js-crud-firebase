// src/app/social/[id]/edit/page.jsx
"use client"

import Container from '@/components/layout/Container'
import { doc, getDoc } from 'firebase/firestore'
import { updateDocument } from '@/lib/firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SocialEditPage = ({ params }) => {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)

    // 기존 게시글 데이터 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'posts', params.id)
                const docSnap = await getDoc(docRef)
                
                if (!docSnap.exists()) {
                    alert('게시글을 찾을 수 없습니다.')
                    router.push('/social')
                    return
                }

                const postData = docSnap.data()
                setTitle(postData.title)
                setContent(postData.content)
            } catch (error) {
                console.error('게시글 조회 실패:', error)
                alert('게시글을 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [params.id, router])

    const handleUpdate = async (event) => {
        event.preventDefault()
        
        if (title.trim() === '' || content.trim() === '') {
            alert('제목과 내용을 입력하세요!')
            return
        }

        try {
            await updateDocument('posts', params.id, { 
                title, 
                content,
                updatedAt: new Date()
            })
            router.push(`/social/${params.id}`)
        } catch (error) {
            console.error('게시글 수정 실패:', error)
            alert('게시글 수정에 실패했습니다.')
        }
    }

    if (loading) {
        return (
            <Container>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="max-w-2xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    게시글 수정
                </h2>
                
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label 
                            htmlFor="title" 
                            className="block text-sm font-medium text-gray-700"
                        >
                            제목
                        </label>
                        <input 
                            id="title" 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     text-gray-900" 
                            placeholder="제목을 입력하세요"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label 
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700"
                        >
                            내용
                        </label>
                        <textarea 
                            id="content" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                     text-gray-900 resize-none"
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white 
                                     border border-gray-300 rounded-md hover:bg-gray-50 
                                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                     transition-colors"
                        >
                            취소
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                                     rounded-md hover:bg-blue-600 focus:outline-none 
                                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                     transition-colors"
                        >
                            수정완료
                        </button>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default SocialEditPage