import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

function NextPage() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { name } = location.state || {};

    useEffect(() => {
        axios.get('https://opentdb.com/api_category.php')
            .then(res => {
                setCategories(res.data.trivia_categories);
            })
            .catch(err => {
                console.error("Failed to fetch categories", err);
            });
    }, []);

    const handleSelectCategory = (categoryName) => {
        if (selectedCategories.includes(categoryName)) return;
        if (selectedCategories.length >= 4) return;
        setSelectedCategories(prev => [...prev, categoryName]);
    };

    const handleRemoveCategory = (categoryName) => {
        setSelectedCategories(prev =>
            prev.filter(cat => cat !== categoryName)
        );
    };

    const handleSelectDifficulty = (selectedDiff) => {
        setDifficulty(selectedDiff);
    };

    const handleContinue = () => {
        navigate('/quiz', {
            state: {
                selectedCategories,
                difficulty,
                name,
            }
        });
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center pt-5 text-white">
            <h2>🎉 Nice!</h2>
            <p>Select 4 categories and a difficulty:</p>

            <Dropdown onSelect={handleSelectCategory} className="mb-3">
                <Dropdown.Toggle variant="primary" id="dropdown-category">
                    {selectedCategories.length < 4
                        ? 'Select a Category'
                        : 'Max 4 Selected'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {categories.map(category => (
                        <Dropdown.Item
                            key={category.id}
                            eventKey={category.name}
                            disabled={
                                selectedCategories.includes(category.name) ||
                                selectedCategories.length >= 4
                            }
                        >
                            {category.name}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {selectedCategories.map(category => (
                    <Badge
                        key={category}
                        bg="info"
                        className="p-2"
                        pill
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveCategory(category)}
                    >
                        {category} ✕
                    </Badge>
                ))}
            </div>

            <Dropdown onSelect={handleSelectDifficulty} className="mb-3">
                <Dropdown.Toggle variant="primary" id="dropdown-difficulty">
                    {'Select Difficulty'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="Easy">Easy</Dropdown.Item>
                    <Dropdown.Item eventKey="Medium">Medium</Dropdown.Item>
                    <Dropdown.Item eventKey="Hard">Hard</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {difficulty && (
                <p className="mb-4">Selected Difficulty: <strong>{difficulty}</strong></p>
            )}

            {selectedCategories.length === 4 && difficulty && (
                <div className="mt-2">
                    <Button variant="success" onClick={handleContinue}>
                        Continue to Quiz
                    </Button>
                </div>
            )}
        </div>
    );
}

export default NextPage;