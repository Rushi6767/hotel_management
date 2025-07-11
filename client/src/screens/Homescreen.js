import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Carousel, Badge } from 'react-bootstrap';
import { DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

function Homescreen() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms/getallrooms');
        setRooms(response.data.rooms || response.data); // Handle both formats
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleShowModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleProceedToBooking = () => {
    if (selectedRoom) {
      setShowModal(false);
      const dateParams = selectedDates ? 
        `?from=${selectedDates[0].format('YYYY-MM-DD')}&to=${selectedDates[1].format('YYYY-MM-DD')}` : '';
      navigate(`/booking/${selectedRoom._id}${dateParams}`);
    }
  };

  const handleBookNow = (room) => {
    if (selectedDates) {
      const dateParams = `?from=${selectedDates[0].format('YYYY-MM-DD')}&to=${selectedDates[1].format('YYYY-MM-DD')}`;
      navigate(`/booking/${room._id}${dateParams}`);
    } else {
      // Show alert to select dates
      alert('Please select your check-in and check-out dates first!');
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Deluxe': 'primary',
      'Standard': 'success',
      'Suite': 'warning',
      'Single': 'info',
      'Family': 'danger',
      'Executive': 'dark'
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">🏨 Luxury Hotel Rooms</h1>
          <p className="lead text-muted">Discover our premium accommodations designed for your comfort</p>
        </div>

        {/* Date Selection Section */}
        <div className="bg-white rounded shadow-sm p-4 mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="text-primary mb-3">
                <i className="fas fa-calendar-alt me-2"></i>
                Select Your Stay Dates
              </h5>
              <p className="text-muted mb-0">
                Choose your check-in and check-out dates to see accurate pricing and availability
              </p>
            </div>
            <div className="col-md-4">
              <RangePicker
                size="large"
                style={{ width: '100%' }}
                placeholder={['Check-in Date', 'Check-out Date']}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  // Disable past dates
                  return current && current < moment().startOf('day');
                }}
              />
            </div>
          </div>
          {selectedDates && (
            <div className="mt-3 p-3 bg-success bg-opacity-10 rounded">
              <div className="row text-center">
                <div className="col-md-6">
                  <strong className="text-success">Check-in:</strong> {selectedDates[0].format('dddd, MMMM Do YYYY')}
                </div>
                <div className="col-md-6">
                  <strong className="text-success">Check-out:</strong> {selectedDates[1].format('dddd, MMMM Do YYYY')}
                </div>
              </div>
              <div className="text-center mt-2">
                <Badge bg="success" className="fs-6">
                  {selectedDates[1].diff(selectedDates[0], 'days')} nights selected
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Row className="g-4">
          {rooms.map((room) => (
            <Col key={room._id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={room.imageurls?.[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'} 
                    alt={room.name}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop';
                    }}
                  />
                  <Badge 
                    bg={getTypeColor(room.type)} 
                    className="position-absolute top-0 end-0 m-2"
                  >
                    {room.type}
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold text-primary mb-2">{room.name}</Card.Title>
                  <Card.Text className="text-muted mb-3">
                    {room.description && room.description.length > 100 
                      ? `${room.description.substring(0, 100)}...` 
                      : room.description || 'No description available'
                    }
                  </Card.Text>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="h5 text-success mb-0">₹{room.rentperday}</span>
                        <small className="text-muted d-block">per day</small>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Max Guests</small>
                        <span className="badge bg-info">{room.maxcount}</span>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <Button 
                        variant="success" 
                        onClick={() => handleBookNow(room)}
                        className="fw-semibold"
                        disabled={!selectedDates}
                      >
                        🗓️ Book Now
                        {selectedDates && (
                          <span className="ms-2">
                            ({selectedDates[1].diff(selectedDates[0], 'days')} nights)
                          </span>
                        )}
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => handleShowModal(room)}
                        className="fw-semibold"
                      >
                        📋 View Details
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Demo Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className="fas fa-bed me-2"></i>
              {selectedRoom?.name}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            {selectedRoom && (
              <div>
                {/* Image Carousel */}
                <Carousel className="mb-4">
                  {selectedRoom.imageurls && selectedRoom.imageurls.length > 0 ? (
                    selectedRoom.imageurls.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={image}
                          alt={`${selectedRoom.name} - Image ${index + 1}`}
                          style={{ height: '300px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop';
                          }}
                        />
                      </Carousel.Item>
                    ))
                  ) : (
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"
                        alt="Default room image"
                        style={{ height: '300px', objectFit: 'cover' }}
                      />
                    </Carousel.Item>
                  )}
                </Carousel>

                {/* Room Details */}
                <Row>
                  <Col md={8}>
                    <h5 className="text-primary mb-3">Room Description</h5>
                    <p className="text-muted">{selectedRoom.description || 'No description available'}</p>
                    
                    <div className="row g-3 mt-4">
                      <div className="col-6">
                        <div className="bg-light p-3 rounded">
                          <small className="text-muted d-block">Room Type</small>
                          <Badge bg={getTypeColor(selectedRoom.type)} className="fs-6">
                            {selectedRoom.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light p-3 rounded">
                          <small className="text-muted d-block">Max Guests</small>
                          <span className="h6 mb-0">{selectedRoom.maxcount} people</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <div className="bg-primary text-white p-4 rounded">
                      <h4 className="mb-3">₹{selectedRoom.rentperday}</h4>
                      <small className="d-block mb-2">per day</small>
                      <Button variant="light" className="w-100 mb-2">
                        📞 Call: {selectedRoom.phonenumber}
                      </Button>
                      <Button 
                        variant="outline-light" 
                        className="w-100" 
                        onClick={handleProceedToBooking}
                        disabled={!selectedDates}
                      >
                        🗓️ Book Now
                        {selectedDates && (
                          <span className="ms-2">
                            ({selectedDates[1].diff(selectedDates[0], 'days')} nights)
                          </span>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={handleProceedToBooking}
              disabled={!selectedDates}
            >
              Proceed to Booking
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Homescreen;
