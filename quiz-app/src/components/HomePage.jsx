import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'; 
import './HomePage.css';
import NextPage from './NextPage';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [formData, setFormData] = useState({ name: '' });
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [questionAnswered, setQuestionAnswered] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ name: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim() === '') {
            setError('Name is required.');
            return;
        }

        setUser(formData.name);
        setSubmitted(true);
        setError(null);
        console.log(`Thanks, ${formData.name}`);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (selectedOption) {
            setQuestionAnswered(true);
            console.log(`You selected: ${selectedOption}`);

            if (selectedOption === 'Correct') {
                navigate('/next', {
                    state: {name: user}
                });
            }
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex flex-column align-items-center pt-5">
            <div className="w-100 bg-color-dark" style={{ textAlign: "center" }}>
                <Row>
                    <Col className="text-center">
                        <h1>Welcome to the Quiz App!</h1>
                        {!submitted && <p>Enter your name below and let's get started.</p>}

                        {!submitted && (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId='userName'>
                                    <Form.Control 
                                        className='w-25 mx-auto'
                                        type='text'
                                        placeholder='Enter your name'
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                {error && <p className="text-danger mt-2">{error}</p>}

                                <Button className="mt-1" variant="primary" type="submit">
                                    Let's get started!
                                </Button>
                            </Form>
                        )}

                        {submitted && (
                            <>
                                <p className='mt-3'>Welcome, {user}!</p>

                                <Form onSubmit={handleQuestionSubmit} className="mt-4">
                                    <h4>Example Question:</h4>
                                    <p>What answer is correct?</p>

                                    <div className="d-flex flex-column align-items-center">
                                        <Form.Check 
                                            type="radio"
                                            label="Nope"
                                            name="quizQuestion"
                                            value="Nope"
                                            checked={selectedOption === 'Nope'}
                                            onChange={handleOptionChange}
                                            className='custom-radio'
                                        />
                                        <Form.Check 
                                            type="radio"
                                            label="Not This One"
                                            name="quizQuestion"
                                            value="Not This One"
                                            checked={selectedOption === 'Not This One'}
                                            onChange={handleOptionChange}
                                            className='custom-radio'
                                        />
                                        <Form.Check 
                                            type="radio"
                                            label="Correct"
                                            name="quizQuestion"
                                            value="Correct"
                                            checked={selectedOption === 'Correct'}
                                            onChange={handleOptionChange}
                                            className='custom-radio'
                                        />
                                        <Form.Check 
                                            type="radio"
                                            label="Nuh Uh"
                                            name="quizQuestion"
                                            value="Nuh Uh"
                                            checked={selectedOption === 'Nuh Uh'}
                                            onChange={handleOptionChange}
                                            className='custom-radio'
                                        />
                                    </div>

                                    <Button className="mt-3" type="submit" variant="success">
                                        Submit Answer
                                    </Button>
                                </Form>

                                {questionAnswered && selectedOption !== 'Correct' && (
                                    <p className="mt-3 text-danger">
                                        Sorry, that's incorrect. Try refreshing to try again.
                                    </p>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default HomePage;