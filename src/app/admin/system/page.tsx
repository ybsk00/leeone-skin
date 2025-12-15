'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Paper,
    Stack,
    Text,
    Button,
    Group,
    TextInput,
    Select,
    Table,
    Badge,
    Modal,
    Alert,
    Card,
    ThemeIcon,
    PasswordInput,
    Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { UserPlus, Shield, Trash2, CheckCircle, AlertCircle, Settings, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface StaffUser {
    user_id: string;
    role: string;
    display_name: string;
    created_at: string;
    email?: string;
}

export default function SystemSettingsPage() {
    const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        role: 'staff' as string,
    });

    const supabase = createClient();

    useEffect(() => {
        fetchStaffUsers();
    }, []);

    async function fetchStaffUsers() {
        setLoading(true);
        const { data, error } = await supabase
            .from('staff_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setStaffUsers(data);
        }
        setLoading(false);
    }

    async function handleAddStaff() {
        if (!formData.email || !formData.password || !formData.displayName) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create user in auth.users via admin API
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    displayName: formData.displayName,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '사용자 생성에 실패했습니다.');
            }

            setSuccess(`${formData.displayName}님이 ${getRoleLabel(formData.role)}(으)로 등록되었습니다.`);
            closeAddModal();
            setFormData({ email: '', password: '', displayName: '', role: 'staff' });
            fetchStaffUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteStaff(userId: string, displayName: string) {
        if (!confirm(`${displayName}님을 관리자에서 제거하시겠습니까?`)) return;

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('staff_users')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            setSuccess(`${displayName}님이 관리자에서 제거되었습니다.`);
            fetchStaffUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function getRoleLabel(role: string) {
        switch (role) {
            case 'admin': return '관리자';
            case 'doctor': return '의사';
            case 'staff': return '직원';
            default: return role;
        }
    }

    function getRoleColor(role: string) {
        switch (role) {
            case 'admin': return 'red';
            case 'doctor': return 'blue';
            case 'staff': return 'green';
            default: return 'gray';
        }
    }

    return (
        <Container size="lg" py="lg">
            {success && (
                <Alert color="green" icon={<CheckCircle size={16} />} mb="md" withCloseButton onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert color="red" icon={<AlertCircle size={16} />} mb="md" withCloseButton onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Group justify="space-between" mb="lg">
                <div>
                    <Title order={2} c="white">시스템 설정</Title>
                    <Text c="dimmed" size="sm">관리자 계정 및 시스템 설정</Text>
                </div>
            </Group>

            {/* 관리자 계정 관리 */}
            <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }} mb="lg">
                <Group justify="space-between" mb="md">
                    <Group gap="sm">
                        <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                            <Users size={20} />
                        </ThemeIcon>
                        <div>
                            <Text fw={600} c="white">관리자 계정</Text>
                            <Text size="xs" c="dimmed">관리자, 의사, 직원 계정 관리</Text>
                        </div>
                    </Group>
                    <Button leftSection={<UserPlus size={16} />} color="orange" onClick={openAddModal}>
                        관리자 추가
                    </Button>
                </Group>

                <Paper radius="md" bg="dark.8" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)', overflow: 'hidden' }}>
                    <Table highlightOnHover highlightOnHoverColor="dark.6">
                        <Table.Thead bg="dark.9">
                            <Table.Tr>
                                <Table.Th c="dimmed">이름</Table.Th>
                                <Table.Th c="dimmed">역할</Table.Th>
                                <Table.Th c="dimmed">등록일</Table.Th>
                                <Table.Th c="dimmed">관리</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {staffUsers.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={4}>
                                        <Text ta="center" c="dimmed" py="lg">등록된 관리자가 없습니다.</Text>
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                staffUsers.map((user) => (
                                    <Table.Tr key={user.user_id}>
                                        <Table.Td>
                                            <Text c="white" fw={500}>{user.display_name || '-'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge color={getRoleColor(user.role)} variant="light">
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text c="dimmed" size="sm">
                                                {new Date(user.created_at).toLocaleDateString('ko-KR')}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button
                                                variant="subtle"
                                                color="red"
                                                size="xs"
                                                leftSection={<Trash2 size={14} />}
                                                onClick={() => handleDeleteStaff(user.user_id, user.display_name || '관리자')}
                                            >
                                                삭제
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Card>

            {/* 시스템 정보 */}
            <Card radius="lg" p="lg" bg="dark.7" withBorder style={{ borderColor: 'var(--mantine-color-dark-5)' }}>
                <Group gap="sm" mb="md">
                    <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                        <Settings size={20} />
                    </ThemeIcon>
                    <div>
                        <Text fw={600} c="white">시스템 정보</Text>
                        <Text size="xs" c="dimmed">현재 시스템 상태 및 설정</Text>
                    </div>
                </Group>

                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text c="dimmed" size="sm">버전</Text>
                        <Text c="white" fw={500}>1.0.0</Text>
                    </Group>
                    <Divider color="dark.5" />
                    <Group justify="space-between">
                        <Text c="dimmed" size="sm">데이터베이스</Text>
                        <Badge color="green" variant="light">연결됨</Badge>
                    </Group>
                    <Divider color="dark.5" />
                    <Group justify="space-between">
                        <Text c="dimmed" size="sm">실시간 알림</Text>
                        <Badge color="green" variant="light">활성</Badge>
                    </Group>
                </Stack>
            </Card>

            {/* 관리자 추가 모달 */}
            <Modal
                opened={addModalOpened}
                onClose={closeAddModal}
                title={<Text fw={700} c="white">관리자 추가</Text>}
                centered
                size="md"
                styles={{
                    header: { backgroundColor: 'var(--mantine-color-dark-7)' },
                    content: { backgroundColor: 'var(--mantine-color-dark-7)' },
                }}
            >
                <Stack gap="md">
                    <TextInput
                        label="이메일"
                        placeholder="admin@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        styles={{
                            input: { backgroundColor: 'var(--mantine-color-dark-6)', borderColor: 'var(--mantine-color-dark-4)', color: 'white' },
                            label: { color: 'var(--mantine-color-gray-4)' }
                        }}
                    />
                    <PasswordInput
                        label="비밀번호"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        styles={{
                            input: { backgroundColor: 'var(--mantine-color-dark-6)', borderColor: 'var(--mantine-color-dark-4)', color: 'white' },
                            label: { color: 'var(--mantine-color-gray-4)' }
                        }}
                    />
                    <TextInput
                        label="이름"
                        placeholder="홍길동"
                        required
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        styles={{
                            input: { backgroundColor: 'var(--mantine-color-dark-6)', borderColor: 'var(--mantine-color-dark-4)', color: 'white' },
                            label: { color: 'var(--mantine-color-gray-4)' }
                        }}
                    />
                    <Select
                        label="역할"
                        data={[
                            { value: 'admin', label: '관리자' },
                            { value: 'doctor', label: '의사' },
                            { value: 'staff', label: '직원' },
                        ]}
                        value={formData.role}
                        onChange={(value) => setFormData(prev => ({ ...prev, role: value || 'staff' }))}
                        styles={{
                            input: { backgroundColor: 'var(--mantine-color-dark-6)', borderColor: 'var(--mantine-color-dark-4)', color: 'white' },
                            label: { color: 'var(--mantine-color-gray-4)' }
                        }}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={closeAddModal}>취소</Button>
                        <Button color="orange" onClick={handleAddStaff} loading={loading}>
                            관리자 추가
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}
