import { createBrowserRouter } from 'react-router'

import App from '@/App'

// 화면을 추가할 때 이 배열에 { path, element }를 넣습니다.
export const router = createBrowserRouter([{ path: '/', element: <App /> }])
