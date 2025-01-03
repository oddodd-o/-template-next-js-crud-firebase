"use client"

import React, { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import SocialEditPage from './[id]/edit/page'
import { db } from '@/lib/firebase/firebase'
import { deleteDocument } from '@/lib/firebase/firestore'

const SocialPage = () => {
    const [posts, setPosts] = useState([])
    const [editingPostId, setEditingPostId] = useState(null)

    // Firestore에서 모든 글을 가져와 상태로 설정
    const fetchPosts = async () => {
        const querySnapshot = await getDocs(query(collection(db, 'posts'), orderBy('title')))
        const postsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
        }))
        setPosts(postsData)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    // 글 삭제
    const handleDelete = async (id) => {
        await deleteDocument('posts', id)
        fetchPosts() // 목록을 다시 불러옵니다.
    }

    // 글 편집 완료
    const handleUpdate = () => {
        setEditingPostId(null)
        fetchPosts() // 업데이트된 목록을 불러옵니다.
    }

    return (
        <div>
            <h2>Posts List</h2>
            {editingPostId ? (
                <SocialEditPage
                    id={editingPostId}
                    initialTitle={posts.find((post) => post.id === editingPostId)?.title ?? ''}
                    initialContent={posts.find((post) => post.id === editingPostId)?.content ?? ''}
                    onCancel={() => setEditingPostId(null)}
                    onUpdate={handleUpdate}
                />
            ) : (
                <>
                    {posts.length > 0 ? (
                        <ul>
                            {posts.map((post) => (
                                <li key={post.id}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <button onClick={() => setEditingPostId(post.id)}>Edit</button>
                                    <button onClick={() => handleDelete(post.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No posts found.</p>
                    )}
                </>
            )}
        </div>
    )
}

export default SocialPage