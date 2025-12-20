"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles, LogIn, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Paper,
    Stack,
    Group,
    Text,
    Textarea,
    ActionIcon,
    Avatar,
    ScrollArea,
    Loader,
    Box,
    ThemeIcon,
    Modal,
    Button,
    rem
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface Message {
    role: "user" | "ai";
    content: string;
}

interface HealthcareChatProps {
    serviceType: string;
    serviceName: string;
    initialMessage: string;
}

// 로그인 모달 트리거 타입
type LoginModalTrigger = "5turn" | "medical" | null;

export default function HealthcareChat({
    serviceType,
    serviceName,
    initialMessage,
}: HealthcareChatProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const entryIntent = searchParams.get("entry_intent") || undefined;

    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: initialMessage },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [turnCount, setTurnCount] = useState(0);
    const [loginModalOpened, { open: openLoginModal, close: closeLoginModal }] = useDisclosure(false);
    const [loginModalTrigger, setLoginModalTrigger] = useState<LoginModalTrigger>(null);
    const viewport = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/healthcare/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages,
                    topic: serviceType,
                    turnCount: turnCount,
                    entryIntent: entryIntent,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "ai", content: data.content }]);

            // 의료 키워드 감지 시 즉시 로그인 모달 표시
            if (data.isSymptomTrigger) {
                setLoginModalTrigger("medical");
                setTimeout(() => openLoginModal(), 500);
                return; // 턴 카운트 증가 안함
            }

            // 턴 카운트 증가
            const newTurnCount = turnCount + 1;
            setTurnCount(newTurnCount);

            // 5턴 완료 또는 하드스탑 시 로그인 모달
            if (data.isHardStop || newTurnCount >= 5) {
                setLoginModalTrigger("5turn");
                setTimeout(() => openLoginModal(), 1000);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: "죄송합니다. 잠시 문제가 발생했습니다. 다시 시도해 주세요.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 로그인 모달 내용 (트리거에 따라 다름)
    const getModalContent = () => {
        if (loginModalTrigger === "medical") {
            return {
                icon: <AlertCircle size={18} />,
                iconColor: "orange",
                title: "전문 상담이 필요합니다",
                description: "말씀하신 내용은 의료 상담 영역입니다. 로그인 후 더 정확한 확인을 진행하실 수 있습니다.",
                cta: "로그인하고 상담 이어가기"
            };
        }
        return {
            icon: <LogIn size={18} />,
            iconColor: "sage-green",
            title: "요약을 저장하세요",
            description: "지금까지의 컨디션 체크 결과를 저장하고, 다음에 1분 만에 이어서 볼 수 있습니다.",
            cta: "로그인하고 저장하기"
        };
    };

    const modalContent = getModalContent();

    return (
        <>
            <Paper
                shadow="xl"
                radius="lg"
                withBorder
                h="calc(100vh - 120px)"
                maw={700}
                mx="auto"
                style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            >
                {/* Header */}
                <Box p="md" bg="sage-green.0" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                    <Group>
                        <ThemeIcon size="lg" radius="xl" color="sage-green" variant="light">
                            <Sparkles size={20} />
                        </ThemeIcon>
                        <div>
                            <Text fw={700} size="lg" c="dark.8">
                                {serviceName}
                            </Text>
                            <Text size="xs" c="dimmed">
                                컨디션 리듬 체크 (참고용)
                            </Text>
                        </div>
                    </Group>
                </Box>

                {/* Messages Area */}
                <ScrollArea viewportRef={viewport} style={{ flex: 1 }} p="md" bg="gray.0">
                    <Stack gap="md">
                        {messages.map((msg, index) => (
                            <Group
                                key={index}
                                align="flex-start"
                                justify={msg.role === "user" ? "flex-end" : "flex-start"}
                                gap="xs"
                            >
                                {msg.role === "ai" && (
                                    <Avatar color="sage-green" radius="xl" size="sm">
                                        <Bot size={16} />
                                    </Avatar>
                                )}

                                <Paper
                                    p="md"
                                    radius="md"
                                    bg={msg.role === "user" ? "sage-green.6" : "white"}
                                    c={msg.role === "user" ? "white" : "dark.8"}
                                    shadow="xs"
                                    maw="85%"
                                    style={{
                                        borderTopRightRadius: msg.role === "user" ? 0 : undefined,
                                        borderTopLeftRadius: msg.role === "ai" ? 0 : undefined,
                                    }}
                                >
                                    <Text size="xs" mb={4} opacity={0.7} fw={500} c={msg.role === "user" ? "white" : "dimmed"}>
                                        {msg.role === "user" ? "나" : serviceName}
                                    </Text>
                                    <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-white prose-headings:text-white prose-p:text-white prose-strong:text-white" : "text-gray-800"}`}>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </Paper>

                                {msg.role === "user" && (
                                    <Avatar color="gray" radius="xl" size="sm">
                                        <User size={16} />
                                    </Avatar>
                                )}
                            </Group>
                        ))}

                        {isLoading && (
                            <Group align="flex-start" gap="xs">
                                <Avatar color="sage-green" radius="xl" size="sm">
                                    <Bot size={16} />
                                </Avatar>
                                <Paper p="md" radius="md" bg="white" shadow="xs" style={{ borderTopLeftRadius: 0 }}>
                                    <Loader size="xs" color="sage-green" type="dots" />
                                </Paper>
                            </Group>
                        )}
                    </Stack>
                </ScrollArea>

                {/* Input Area */}
                <Box p="md" bg="white" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
                    <Group align="flex-end" gap="sm">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.currentTarget.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="답변을 입력해주세요..."
                            autosize
                            minRows={1}
                            maxRows={4}
                            style={{ flex: 1 }}
                            styles={{ input: { padding: '10px' } }}
                        />
                        <ActionIcon
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            size="lg"
                            color="sage-green"
                            variant="filled"
                            mb={4}
                        >
                            <Send size={18} />
                        </ActionIcon>
                    </Group>
                    <Text size="xs" c="dimmed" ta="center" mt="xs">
                        참고용 정보이며 의학적 진단을 대체하지 않습니다.
                    </Text>
                </Box>
            </Paper>

            {/* Login Modal - 동적 내용 */}
            <Modal
                opened={loginModalOpened}
                onClose={closeLoginModal}
                title={
                    <Group gap="xs">
                        <ThemeIcon color={modalContent.iconColor} variant="light" radius="xl">
                            {modalContent.icon}
                        </ThemeIcon>
                        <Text fw={700}>{modalContent.title}</Text>
                    </Group>
                }
                centered
                radius="lg"
            >
                <Stack gap="md" py="md">
                    <Text size="sm" c="dimmed">
                        {modalContent.description}
                    </Text>
                    <Stack gap="xs">
                        <Button
                            fullWidth
                            color="sage-green"
                            size="md"
                            onClick={() => router.push('/patient/login')}
                        >
                            {modalContent.cta}
                        </Button>
                        <Button
                            fullWidth
                            variant="light"
                            color="sage-green"
                            size="md"
                            onClick={() => router.push('/patient/signup')}
                        >
                            회원가입하기
                        </Button>
                    </Stack>
                    <Text size="xs" c="dimmed" ta="center">
                        로그인하면 결과를 저장하고 비교할 수 있습니다.
                    </Text>
                </Stack>
            </Modal>
        </>
    );
}

