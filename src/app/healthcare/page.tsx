import { redirect } from 'next/navigation';

// /healthcare 접근 시 인덱스 페이지로 리디렉션
export default function HealthcarePage() {
    redirect('/');
}
