import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function QuestionForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedCategories, difficulty } = state || {};

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const {name} = location.state || {};

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];

      const categoryResponse = await axios.get('https://opentdb.com/api_category.php');
      const categoryData = categoryResponse.data.trivia_categories;
      const matchedCategory = categoryData.find(cat => cat.name === randomCategory);
      const categoryId = matchedCategory?.id;

      if (!categoryId) throw new Error('Category not found');

      const apiUrl = `https://opentdb.com/api.php?amount=1&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
      const response = await axios.get(apiUrl);
      const fetchedQuestion = response.data.results[0];

      setQuestion(fetchedQuestion);
      setAnswers(shuffleArray([
        fetchedQuestion.correct_answer,
        ...fetchedQuestion.incorrect_answers,
      ]));
      setSelectedAnswer('');
      setFeedback('');
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategories && difficulty) {
      fetchQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, difficulty]);

  const handleSelection = (e) => {
    setSelectedAnswer(e.target.value);
    setFeedback('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setFeedback('Please select an answer before submitting.');
      return;
    }
    const isCorrect = selectedAnswer === question.correct_answer;
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect!');
    setShowModal(true);
  };

  if (loading) {
    return <Spinner animation="border" variant="light" />;
  }

  if (!question) return <p className="text-danger">No question available.</p>;

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center pt-5 text-white">
      <h4>{decodeHtml(question.question)}</h4>

      <Form onSubmit={handleSubmit}>
        {answers.map((answer, index) => (
          <Form.Check
            key={index}
            type="radio"
            name="quiz"
            label={decodeHtml(answer)}
            value={answer}
            checked={selectedAnswer === answer}
            onChange={handleSelection}
            className="my-2"
          />
        ))}

        <Button type="submit" className="mt-3" variant="primary">
          Submit Answer
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Let's see your result, {name}!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold">{feedback}</p>
          {selectedAnswer !== question.correct_answer && (
            <p>
              Correct Answer: <strong>{decodeHtml(question.correct_answer)}</strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Return Home
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false);
            fetchQuestion();
          }}>
            Next Question
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default QuestionForm;