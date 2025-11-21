export const initialThreads = [
  {
    id: 'thread-1',
    category: 'announcement',
    authorId: 'vs000001',
    title: 'Thông báo goon',
    content: 'Tôi muốn goon',
    attachment: null,
    createdAt: '2025-01-05T07:00:00.000Z',
    updatedAt: '2025-01-05T09:30:00.000Z',
    author: {
      name: 'Phạm Lê Mạnh HÙng',
      initials: 'MH',
      role: 'student',
    },
    replies: [
      {
        id: 'reply-1',
        parentId: null,
        authorId: 'demo-user-comment-1',
        author: {
          name: 'Nguyễn Nam Khánh 9A3',
          initials: 'NK',
          role: 'student',
        },
        text: 'Cho goon cùng',
        createdAt: '2025-01-05T08:00:00.000Z',
      },
      {
        id: 'reply-2',
        parentId: 'reply-1',
        authorId: 'demo-user-comment-2',
        author: {
          name: 'Quang Tùng',
          initials: 'QT',
          role: 'student',
        },
        text: 'Tuff',
        createdAt: '2025-01-05T08:15:00.000Z',
      },
    ],
  },
  {
    id: 'thread-2',
    category: 'qa',
    authorId: 'vs000001',
    title: 'Việc goon hoạt động thế nào?',
    content:
      'Tôi không biết nhiều về goon, khi bạn goon, tại sao bạn lại muốn goon tiếp?!?!?!?!!?',
    attachment: null,
    createdAt: '2025-01-04T10:00:00.000Z',
    updatedAt: '2025-01-05T04:00:00.000Z',
    author: {
      name: 'Hoàng Gia Phong',
      initials: 'GP',
      role: 'student',
    },
    replies: [],
  },
  {
    id: 'thread-3',
    category: 'resources',
    authorId: 'tuffmx67',
    title: 'Tài liệu ôn tập goon Gay',
    content:
      'Nhiều người trong lớp 9E8 vẫn chưa biết cách goon gay, thế nên tôi sẽ chia sẻ tài liệu ôn tập này.',
    attachment: {
      name: 'tai_lieu_pay_gorn.pdf',
      size: '6-7 MB',
    },
    createdAt: '2025-01-01T06:00:00.000Z',
    updatedAt: '2025-01-03T06:00:00.000Z',
    author: {
      name: 'Quang Tùng',
      initials: 'QT',
      role: 'teacher',
    },
    replies: [],
  },
  {
    id: 'thread-4',
    category: 'entertainment',
    authorId: 'vs000000',
    title: 'Giao lưu Team Fortress 2',
    content:
      'ae ơi ai chơi tf2 thì gặp nhau tại san hô sh 2a-30 nhé, nhớ chỉ chơi class sniper và scout',
    attachment: null,
    createdAt: '2024-12-30T02:00:00.000Z',
    updatedAt: '2025-01-02T02:00:00.000Z',
    author: {
      name: 'Hữu Phong',
      initials: 'HP',
      role: 'student',
    },
    replies: [],
  },
];

export const categoryLabels = {
  all: 'Tất cả',
  announcement: '📢 Thông báo',
  qa: '❓ Hỏi đáp',
  resources: '📚 Tài liệu',
  entertainment: '🎮 Giải trí',
};

