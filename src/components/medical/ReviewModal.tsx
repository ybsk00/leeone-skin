'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Stack, Text, Group, ThemeIcon, Tabs, Card, Badge, Loader, Center, Alert } from '@mantine/core';
import { MessageSquare, ExternalLink, AlertCircle, Coffee, Globe } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReviewItem {
    title: string;
    link: string;
    description: string;
    author: string;
    postdate: string;
    origin: string;
}

interface ReviewResponse {
    source: string;
    query: string;
    items: ReviewItem[];
    meta: { total: number; start: number; display: number };
    isDummy?: boolean;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
    const [activeTab, setActiveTab] = useState<string | null>('blog');
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDummy, setIsDummy] = useState(false);

    useEffect(() => {
        if (isOpen && activeTab) {
            fetchReviews(activeTab);
        }
    }, [isOpen, activeTab]);

    const fetchReviews = async (source: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/reviews/search?source=${source}`);
            const data: ReviewResponse = await response.json();
            setReviews(data.items || []);
            setIsDummy(data.isDummy || false);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewClick = (item: ReviewItem, index: number) => {
        // 이벤트 로깅
        console.log('review_click_out', {
            source: activeTab,
            rank: index + 1,
            link: item.link
        });

        window.open(item.link, '_blank', 'noopener,noreferrer');
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <ThemeIcon color="orange" variant="light" radius="xl">
                        <MessageSquare size={18} />
                    </ThemeIcon>
                    <Text fw={700}>후기 보기</Text>
                </Group>
            }
            centered
            radius="lg"
            size="lg"
        >
            <Stack gap="md">
                {/* 안내 문구 */}
                <Alert color="gray" variant="light" icon={<AlertCircle size={16} />}>
                    <Text size="xs">
                        외부 페이지로 이동합니다. 후기는 당사에서 작성/편집하지 않습니다.
                    </Text>
                </Alert>

                {isDummy && (
                    <Alert color="yellow" variant="light">
                        <Text size="xs">
                            네이버 API 키가 설정되지 않아 샘플 데이터를 표시합니다.
                        </Text>
                    </Alert>
                )}

                {/* 탭 */}
                <Tabs value={activeTab} onChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value="blog" leftSection={<MessageSquare size={14} />}>
                            블로그
                        </Tabs.Tab>
                        <Tabs.Tab value="cafearticle" leftSection={<Coffee size={14} />}>
                            카페
                        </Tabs.Tab>
                        <Tabs.Tab value="webkr" leftSection={<Globe size={14} />}>
                            웹문서
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                {/* 후기 목록 */}
                <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
                    {loading ? (
                        <Center h={200}>
                            <Loader color="orange" />
                        </Center>
                    ) : reviews.length === 0 ? (
                        <Center h={200}>
                            <Text c="dimmed">검색 결과가 없습니다.</Text>
                        </Center>
                    ) : (
                        <Stack gap="sm">
                            {reviews.map((item, index) => (
                                <Card
                                    key={index}
                                    padding="sm"
                                    radius="md"
                                    withBorder
                                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => handleReviewClick(item, index)}
                                >
                                    <Group justify="space-between" wrap="nowrap">
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Text
                                                size="sm"
                                                fw={600}
                                                lineClamp={1}
                                                className="text-gray-900"
                                            >
                                                {item.title}
                                            </Text>
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                lineClamp={2}
                                                mt={4}
                                            >
                                                {item.description}
                                            </Text>
                                            <Group gap="xs" mt={8}>
                                                <Badge size="xs" variant="light" color="gray">
                                                    {item.author}
                                                </Badge>
                                                {item.postdate && (
                                                    <Text size="xs" c="dimmed">
                                                        {item.postdate}
                                                    </Text>
                                                )}
                                            </Group>
                                        </div>
                                        <ThemeIcon variant="light" color="gray" size="sm">
                                            <ExternalLink size={14} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </div>

                {/* 하단 안내 */}
                <Text size="xs" c="dimmed" ta="center">
                    클릭 시 외부 페이지로 이동합니다.
                </Text>
            </Stack>
        </Modal>
    );
}
