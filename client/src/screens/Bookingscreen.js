import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel, ListGroup, Alert } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

function Bookingscreen() {
  const { roomid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    // Parse dates from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const fromDate = urlParams.get('from');
    const toDate = urlParams.get('to');
    
    if (fromDate && toDate) {
      const checkIn = moment(fromDate);
      const checkOut = moment(toDate);
      setCheckInDate(checkIn);
      setCheckOutDate(checkOut);
      setTotalDays(checkOut.diff(checkIn, 'days'));
    }

    const fetchRoom = async () => {
      try {
        console.log('Fetching room with ID:', roomid);
        const response = await axios.get(`/api/rooms/getroombyid/${roomid}`);
        console.log('Room data received:', response.data);
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room details. Please make sure the server is running.');
        setLoading(false);
      }
    };

    if (roomid) {
      fetchRoom();
    }
  }, [roomid, location.search]);

  const handlePaymentClick = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select your check-in and check-out dates first!');
      return;
    }
    // TODO: Show payment form in future
    alert('Payment form will be implemented here!');
    // setShowPaymentForm(true);
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

  const getAmenities = (type) => {
    const amenities = {
      'Deluxe': ['King Size Bed', 'Ocean View', 'Balcony', 'Mini Bar', 'Room Service', 'Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
      'Standard': ['Queen Size Bed', 'City View', 'Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
      'Suite': ['King Size Bed', 'Living Area', 'Work Desk', 'Mini Bar', 'Room Service', 'Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker', 'Bathrobe'],
      'Single': ['Single Bed', 'Free WiFi', 'Air Conditioning', 'TV'],
      'Family': ['Multiple Beds', 'Connecting Rooms', 'Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker', 'Extra Space'],
      'Executive': ['King Size Bed', 'Work Area', 'Meeting Space', 'Mini Bar', 'Room Service', 'Free WiFi', 'Air Conditioning', 'TV', 'Coffee Maker', 'Bathrobe', 'Premium Toiletries']
    };
    return amenities[type] || ['Free WiFi', 'Air Conditioning', 'TV'];
  };

  const calculateTotalPrice = () => {
    if (!room || !totalDays) return 0;
    const basePrice = room.rentperday * totalDays;
    const taxes = basePrice * 0.18; // 18% GST
    return basePrice + taxes;
  };

  if (loading) {
    return (
      <div className="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error || 'Room not found'}
          </div>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const amenities = getAmenities(room.type);

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-5">
        <Container>
          <div className="text-center">
            <Badge bg={getTypeColor(room.type)} className="fs-6 mb-3 px-3 py-2">
              {room.type} Room
            </Badge>
            <h1 className="display-4 fw-bold mb-3">{room.name}</h1>
            <p className="lead mb-0">Experience luxury and comfort in this beautifully appointed room</p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        {/* Booking Details Alert */}
        {checkInDate && checkOutDate && (
          <Alert variant="success" className="mb-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h5 className="mb-2">
                  <i className="fas fa-calendar-check me-2"></i>
                  Your Booking Details
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Check-in:</strong> {checkInDate.format('dddd, MMMM Do YYYY')}
                  </div>
                  <div className="col-md-6">
                    <strong>Check-out:</strong> {checkOutDate.format('dddd, MMMM Do YYYY')}
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <Badge bg="success" className="fs-5 px-3 py-2">
                  {totalDays} {totalDays === 1 ? 'Night' : 'Nights'}
                </Badge>
              </div>
            </div>
          </Alert>
        )}

        <Row className="g-5">
          {/* Main Content */}
          <Col lg={8}>
            {/* Image Gallery */}
            <Card className="shadow-lg border-0 mb-5">
              <Card.Body className="p-0">
                <Carousel className="room-carousel">
                  {room.imageurls && room.imageurls.length > 0 ? (
                    room.imageurls.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={image}
                          alt={`${room.name} - Image ${index + 1}`}
                          style={{ height: '500px', objectFit: 'cover' }}
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
                        style={{ height: '500px', objectFit: 'cover' }}
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
              </Card.Body>
            </Card>

            {/* Room Description */}
            <Card className="shadow-lg border-0 mb-5">
              <Card.Header className="bg-primary text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Room Description
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <p className="lead text-muted mb-4">
                  {room.description || 'Experience luxury and comfort in this beautifully appointed room designed to provide you with the perfect stay. Our rooms are thoughtfully designed with modern amenities and elegant furnishings to ensure your comfort and satisfaction.'}
                </p>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="bg-light p-4 rounded text-center">
                      <i className="fas fa-users fa-2x text-primary mb-3"></i>
                      <h5 className="text-primary">Maximum Guests</h5>
                      <p className="h3 fw-bold text-success">{room.maxcount} People</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light p-4 rounded text-center">
                      <i className="fas fa-bed fa-2x text-primary mb-3"></i>
                      <h5 className="text-primary">Room Type</h5>
                      <Badge bg={getTypeColor(room.type)} className="fs-5 px-3 py-2">
                        {room.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Amenities */}
            <Card className="shadow-lg border-0 mb-5">
              <Card.Header className="bg-success text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-star me-2"></i>
                  Room Amenities
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  {amenities.map((amenity, index) => (
                    <Col key={index} md={6} lg={4}>
                      <div className="d-flex align-items-center p-3 bg-light rounded">
                        <i className="fas fa-check-circle text-success me-3"></i>
                        <span className="fw-semibold">{amenity}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Location & Contact */}
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-info text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Location & Contact
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="text-center p-4 bg-light rounded">
                      <i className="fas fa-map-marker-alt fa-2x text-info mb-3"></i>
                      <h5 className="text-info">Hotel Location</h5>
                      <p className="mb-0">123 Luxury Street<br />Mumbai, Maharashtra 400001<br />India</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="text-center p-4 bg-light rounded">
                      <i className="fas fa-phone fa-2x text-info mb-3"></i>
                      <h5 className="text-info">Contact Number</h5>
                      <p className="mb-0">
                        <a href={`tel:${room.phonenumber}`} className="text-decoration-none">
                          {room.phonenumber || '+91 9876543210'}
                        </a>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Pricing Card */}
            <Card className="shadow-lg border-0 sticky-top" style={{ top: '2rem' }}>
              <Card.Header className="bg-warning text-dark py-3">
                <h4 className="mb-0">
                  <i className="fas fa-tag me-2"></i>
                  Pricing Details
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                {checkInDate && checkOutDate ? (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-success fw-bold">₹{calculateTotalPrice().toFixed(0)}</h2>
                      <p className="text-muted mb-0">Total for {totalDays} {totalDays === 1 ? 'night' : 'nights'}</p>
                    </div>

                    <ListGroup className="mb-4">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Room Rate (₹{room.rentperday} × {totalDays})</span>
                        <span className="fw-bold">₹{(room.rentperday * totalDays).toFixed(0)}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Taxes & Fees (18% GST)</span>
                        <span className="fw-bold">₹{((room.rentperday * totalDays) * 0.18).toFixed(0)}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
                        <span className="fw-bold">Total Amount</span>
                        <span className="fw-bold text-success fs-5">₹{calculateTotalPrice().toFixed(0)}</span>
                      </ListGroup.Item>
                    </ListGroup>

                    <div className="d-grid gap-3">
                      <Button
                        variant="success"
                        size="lg"
                        onClick={handlePaymentClick}
                        className="fw-bold py-3"
                      >
                        <i className="fas fa-credit-card me-2"></i>
                        💳 Book Now & Pay
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="text-success fw-bold">₹{room.rentperday}</h2>
                      <p className="text-muted mb-0">per night</p>
                    </div>

                    <Alert variant="warning" className="text-center">
                      <i className="fas fa-calendar-alt me-2"></i>
                      Please select dates to see total pricing
                    </Alert>

                    <ListGroup className="mb-4">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Room Rate</span>
                        <span className="fw-bold">₹{room.rentperday}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Taxes & Fees</span>
                        <span className="fw-bold">₹{(room.rentperday * 0.18).toFixed(0)}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
                        <span className="fw-bold">Total per Night</span>
                        <span className="fw-bold text-success fs-5">₹{(room.rentperday * 1.18).toFixed(0)}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </>
                )}
                
                <div className="d-grid gap-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate('/')}
                    className="py-2"
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to All Rooms
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1"></i>
                    Secure booking guaranteed
                  </small>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-lg border-0 mt-4">
              <Card.Header className="bg-secondary text-white py-3">
                <h5 className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Quick Info
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="text-center">
                      <i className="fas fa-sign-in-alt text-primary mb-2"></i>
                      <p className="mb-0"><strong>Check-in</strong><br />2:00 PM</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <i className="fas fa-sign-out-alt text-primary mb-2"></i>
                      <p className="mb-0"><strong>Check-out</strong><br />11:00 AM</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <i className="fas fa-wifi text-primary mb-2"></i>
                      <p className="mb-0"><strong>Free WiFi</strong><br />Available</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <i className="fas fa-parking text-primary mb-2"></i>
                      <p className="mb-0"><strong>Parking</strong><br />Free</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bookingscreen;
