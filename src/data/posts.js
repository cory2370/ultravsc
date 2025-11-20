export const initialPosts = [
  {
    id: 1,
    category: 'announcement',
    authorId: 'demo-user-1', // Demo author ID
    author: {
      name: 'Phạm Lê Mạnh HÙng',
      initials: 'MH',
    },
    time: '2 giờ trước',
    title: 'Thông báo goon',
    content: 'Tôi muốn goon',
    likes: 67,
    liked: false,
    comments: [
      {
        id: 1,
        author: {
          name: 'Nguyễn Nam Khánh',
          initials: 'NK',
        },
        text: 'Cho goon cùng',
      },
      {
        id: 2,
        author: {
          name: 'Quang Tùng',
          initials: 'QT',
        },
        text: 'Giết hết người da đen',
      },
    ],
  },
  {
    id: 2,
    category: 'qa',
    authorId: 'demo-user-2',
    author: {
      name: 'Hoàng Gia Phong',
      initials: 'GP',
    },
    time: '5 giờ trước',
    title: 'Việc goon hoạt động thế nào?',
    content: 'Tôi không biết nhiều về goon, khi bạn goon, tại sao bạn lại muốn goon tiếp?!?!?!?!!?',
    likes: 8,
    liked: true,
    comments: [],
  },
  {
    id: 3,
    category: 'resources',
    authorId: 'demo-user-3',
    author: {
      name: 'Quang Tùng',
      initials: 'QT',
    },
    time: '6 đến 7 ngày trước',
    title: 'Tài liệu ôn tập goon Gay',
    content: 'Nhiều người trong lớp 9E8 vẫn chưa biết cách goon gay, thế nên tôi sẽ chia sẻ tài liệu ôn tập này.',
    attachment: {
      name: 'tai_lieu_pay_gorn.pdf',
      size: '6-7 MB',
    },
    likes: 45,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    category: 'entertainment',
    authorId: 'demo-user-4',
    author: {
      name: 'Hữu Phong',
      initials: 'HP',
    },
    time: '2 ngày trước',
    title: 'Giao lưu Team Fortress 2',
    content: 'ae ơi ai chơi tf2 thì gặp nhau tại san hô sh 2a-30 nhé, nhớ chỉ chơi class sniper và scout',
    likes: 15,
    liked: false,
    comments: [],
  },
];

export const categoryLabels = {
  all: 'Tất cả',
  announcement: '📢 Thông báo',
  qa: '❓ Hỏi đáp',
  resources: '📚 Tài liệu',
  entertainment: '🎮 Giải trí',
};

