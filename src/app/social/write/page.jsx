"use client"

import Container from '@/components/layout/Container'
import { addDocument } from '@/lib/firebase/firestore'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const SocialWritePage = () => {
   const router = useRouter()
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')

   // 폼 제출 시 Firestore에 데이터를 추가하는 함수 호출
   const handleSubmit = async (event) => {
       event.preventDefault()
       // 입력된 데이터 유효성 검사
       if (title.trim() === '' || content.trim() === '') {
           alert('제목과 내용을 입력하세요!')
           return
       }

       // Firestore에 문서 추가
       try {
           await addDocument('posts', { 
               title, 
               content,
               createdAt: new Date(),
               updatedAt: new Date()
           })
           alert('새 게시물이 추가되었습니다!')
           router.push('/social') // 목록 페이지로 이동
       } catch (error) {
           console.error('게시물 추가 중 오류 발생:', error)
           alert('게시물 추가에 실패했습니다.')
       }
   }

   return (
       <Container>
           <div className="max-w-2xl mx-auto p-6">
               <h1 className="text-2xl font-bold text-gray-900 mb-6">
                   새 게시물 작성
               </h1>
               
               <form onSubmit={handleSubmit} className="space-y-6">
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
                           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
                           rows={10}
                           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="내용을 입력하세요"
                       />
                   </div>

                   <div className="flex justify-end space-x-2">
                       <button
                           type="button"
                           onClick={() => router.back()}
                           className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                       >
                           취소
                       </button>
                       <button 
                           type="submit"
                           className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                       >
                           작성완료
                       </button>
                   </div>
               </form>
           </div>
       </Container>
   )
}

export default SocialWritePage