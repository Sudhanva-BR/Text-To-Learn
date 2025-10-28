import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
  Divider,
  useToast,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { FiCheck, FiX, FiRotateCcw } from 'react-icons/fi';

const Quiz = ({ questions }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const toast = useToast();

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: parseInt(value),
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: 'Incomplete Quiz',
        description: 'Please answer all questions before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore({ correct, total: questions.length, percentage });
    setSubmitted(true);

    toast({
      title: 'Quiz Submitted!',
      description: `You scored ${correct}/${questions.length} (${percentage}%)`,
      status: percentage >= 70 ? 'success' : 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep studying!';
  };

  return (
    <Box my={6} p={6} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
      <Heading size="md" mb={4} color="blue.700">
        📝 Quiz Time!
      </Heading>

      {submitted && score && (
        <Alert status={score.percentage >= 70 ? 'success' : 'warning'} mb={4}>
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {getScoreMessage(score.percentage)} You scored {score.correct}/
              {score.total} ({score.percentage}%)
            </Text>
            <Badge colorScheme={getScoreColor(score.percentage)}>{score.percentage}%</Badge>
          </VStack>
        </Alert>
      )}

      <VStack spacing={6} align="stretch">
        {questions.map((question, questionIndex) => (
          <Box
            key={questionIndex}
            p={4}
            bg="white"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <Text fontWeight="bold" mb={3} fontSize="md">
              {questionIndex + 1}. {question.question}
            </Text>

            <RadioGroup
              value={answers[questionIndex]?.toString() || ''}
              onChange={(value) => handleAnswerChange(questionIndex, value)}
              isDisabled={submitted}
            >
              <VStack align="stretch" spacing={2}>
                {question.options.map((option, optionIndex) => {
                  const isCorrect = submitted && optionIndex === question.correct;
                  const isSelected = submitted && answers[questionIndex] === optionIndex;
                  const isWrong = submitted && isSelected && !isCorrect;

                  return (
                    <HStack
                      key={optionIndex}
                      p={3}
                      borderRadius="md"
                      bg={
                        submitted
                          ? isCorrect
                            ? 'green.50'
                            : isWrong
                            ? 'red.50'
                            : 'gray.50'
                          : 'white'
                      }
                      border={
                        submitted
                          ? isCorrect || isWrong
                            ? '2px solid'
                            : '1px solid'
                          : '1px solid'
                      }
                      borderColor={
                        submitted
                          ? isCorrect
                            ? 'green.300'
                            : isWrong
                            ? 'red.300'
                            : 'gray.200'
                          : 'gray.200'
                      }
                    >
                      <Radio
                        value={optionIndex.toString()}
                        colorScheme={
                          submitted
                            ? isCorrect
                              ? 'green'
                              : isWrong
                              ? 'red'
                              : 'gray'
                            : 'blue'
                        }
                      />
                      <Text
                        flex="1"
                        color={
                          submitted
                            ? isCorrect
                              ? 'green.700'
                              : isWrong
                              ? 'red.700'
                              : 'gray.600'
                            : 'black'
                        }
                      >
                        {option}
                      </Text>

                      {submitted && (
                        <Box>
                          {isCorrect && <FiCheck color="green" size={20} />}
                          {isWrong && <FiX color="red" size={20} />}
                        </Box>
                      )}
                    </HStack>
                  );
                })}
              </VStack>
            </RadioGroup>

            {submitted && (
              <Box mt={3} p={3} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" color="blue.700" fontWeight="medium">
                  💡 Explanation: {question.explanation}
                </Text>
              </Box>
            )}
          </Box>
        ))}
      </VStack>

      <Divider my={4} />

      <Flex justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          {Object.keys(answers).length} of {questions.length} questions answered
        </Text>

        <HStack spacing={2}>
          {submitted ? (
            <Button
              leftIcon={<FiRotateCcw />}
              colorScheme="blue"
              variant="outline"
              onClick={handleReset}
            >
              Retake Quiz
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={Object.keys(answers).length !== questions.length}
            >
              Submit Quiz
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Quiz;
