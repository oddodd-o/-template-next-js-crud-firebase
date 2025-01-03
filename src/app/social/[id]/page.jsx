// src/app/social/[id]/page.jsx
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/layout/Container'

async function SocialDetailPage({ params }) {
 const docRef = doc(db, 'posts', params.id)
 const docSnap = await getDoc(docRef)

 if (!docSnap.exists()) {
   notFound()
 }

 const post = docSnap.data()

 return (
   <Container>
     <article className="max-w-3xl mx-auto">
       {/* 게시글 헤더 */}
       <div className="mb-8 pb-4 border-b border-gray-200">
         <h2 className="text-3xl font-bold text-gray-900">{post.title}</h2>
         <div className="mt-2 text-sm text-gray-500">
           {post.createdAt && new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
         </div>
       </div>

       {/* 게시글 본문 */}
       <div className="prose max-w-none mb-8">
         <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
           {post.content}
         </p>
       </div>

       {/* 하단 내비게이션 */}
       <div className="flex justify-between items-center pt-6 border-t border-gray-200">
         <Link 
           href="/social"
           className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
         >
           <svg 
             className="w-5 h-5 mr-2" 
             fill="none" 
             stroke="currentColor" 
             viewBox="0 0 24 24"
           >
             <path 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               strokeWidth={2} 
               d="M15 19l-7-7 7-7" 
             />
           </svg>
           목록으로
         </Link>

         <div className="space-x-2">
           <Link
             href={`/social/${params.id}/edit`}
             className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
           >
             수정하기
           </Link>
         </div>
       </div>

       {/* 메타 정보 */}
       {post.authorName && (
         <div className="mt-8 text-sm text-gray-500">
           작성자: {post.authorName}
         </div>
       )}
     </article>
   </Container>
 )
}

export async function generateStaticParams() {
 return []
}

export default SocialDetailPage