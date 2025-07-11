import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaDownload, FaHome, FaExclamationTriangle, FaClock, FaWifi, FaParking } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
import './BookingSuccess.css';

function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchSessionDetails(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      // Trigger animation after component mounts
      setTimeout(() => setShowAnimation(true), 100);
    }
  }, [session]);

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await axios.get(`/api/checkout/session/${sessionId}`);
      setSession(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    const receipt = `
      🏨 HOTEL BOOKING RECEIPT
      ========================
      
      📅 Booking ID: ${session?.metadata?.roomId || 'N/A'}
      🏠 Room: ${session?.metadata?.roomName || 'N/A'}
      🏷️ Type: ${session?.metadata?.roomType || 'N/A'}
      
      📅 Check-in: ${moment(session?.metadata?.fromDate).format('DD/MM/YYYY')}
      📅 Check-out: ${moment(session?.metadata?.toDate).format('DD/MM/YYYY')}
      🌙 Duration: ${session?.metadata?.totalDays || 'N/A'} ${session?.metadata?.totalDays === '1' ? 'night' : 'nights'}
      
      💰 Amount: ₹${session?.amount_total ? (session.amount_total / 100).toFixed(2) : 'N/A'}
      ✅ Payment Status: ${session?.payment_status === 'paid' ? 'Paid' : 'Pending'}
      🔢 Transaction ID: ${session?.payment_intent || 'N/A'}
      
      📅 Date: ${moment().format('DD/MM/YYYY HH:mm')}
      
      🙏 Thank you for choosing our hotel!
      🎉 We look forward to welcoming you!
    `;

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-receipt-${session?.metadata?.roomId || 'receipt'}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Alert variant="danger">
            <FaExclamationTriangle className="me-2" />
            {error || 'Booking details not found'}
          </Alert>
          <Button variant="primary" onClick={() => navigate('/')}>
            <FaHome className="me-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-success min-vh-100">
      {/* Success Header with Animation */}
      <div className={`bg-white py-5 ${showAnimation ? 'animate__animated animate__fadeInDown' : ''}`}>
        <Container>
          <div className="text-center">
            <div className={`mb-4 ${showAnimation ? 'animate__animated animate__bounceIn' : ''}`}>
              <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
            </div>
            <h1 className="display-4 fw-bold text-success mb-3">Payment Successful!</h1>
            <p className="lead text-muted mb-0">Your booking has been confirmed and payment processed</p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Success Alert */}
            <Alert variant="success" className={`mb-4 ${showAnimation ? 'animate__animated animate__fadeInUp' : ''}`}>
              <div className="d-flex align-items-center">
                <FaCheckCircle className="me-3" style={{ fontSize: '1.5rem' }} />
                <div>
                  <h5 className="mb-1">Booking Confirmed</h5>
                  <p className="mb-0">You will receive a confirmation email shortly with all the details.</p>
                </div>
              </div>
            </Alert>

            {/* Booking Details Card */}
            <Card className={`shadow-lg border-0 mb-4 ${showAnimation ? 'animate__animated animate__fadeInUp' : ''}`} style={{ animationDelay: '0.2s' }}>
              <Card.Header className="bg-primary text-white py-3">
                <h4 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Booking Details
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaMapMarkerAlt className="text-primary" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Room</small>
                        <div className="fw-bold fs-5">{session.metadata?.roomName || 'N/A'}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaCalendarAlt className="text-primary" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Room Type</small>
                        <div className="fw-bold fs-5">{session.metadata?.roomType || 'N/A'}</div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaCalendarAlt className="text-success" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Check-in</small>
                        <div className="fw-bold fs-5">
                          {moment(session.metadata?.fromDate).format('dddd, MMMM Do YYYY')}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaCalendarAlt className="text-danger" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Check-out</small>
                        <div className="fw-bold fs-5">
                          {moment(session.metadata?.toDate).format('dddd, MMMM Do YYYY')}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaClock className="text-info" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Duration</small>
                        <div className="fw-bold fs-5">
                          {session.metadata?.totalDays || 'N/A'} {session.metadata?.totalDays === '1' ? 'night' : 'nights'}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <FaCreditCard className="text-warning" style={{ fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <small className="text-muted">Payment Status</small>
                        <div>
                          <Badge bg={session.payment_status === 'paid' ? 'success' : 'warning'} className="fs-6 px-3 py-2">
                            {session.payment_status === 'paid' ? 'Paid' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Details Card */}
            <Card className={`shadow-lg border-0 mb-4 ${showAnimation ? 'animate__animated animate__fadeInUp' : ''}`} style={{ animationDelay: '0.4s' }}>
              <Card.Header className="bg-success text-white py-3">
                <h4 className="mb-0">
                  <FaCreditCard className="me-2" />
                  Payment Details
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="bg-light p-4 rounded text-center">
                      <h3 className="text-success fw-bold mb-2">
                        ₹{(session.amount_total / 100).toFixed(2)}
                      </h3>
                      <p className="text-muted mb-0">Total Amount Paid</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-4 rounded text-center">
                      <h5 className="text-primary mb-2">Transaction ID</h5>
                      <p className="text-muted mb-0 font-monospace">
                        {session.payment_intent || 'N/A'}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <Card className={`shadow-lg border-0 mb-4 ${showAnimation ? 'animate__animated animate__fadeInUp' : ''}`} style={{ animationDelay: '0.6s' }}>
              <Card.Body className="p-4">
                <Row className="g-3">
                  <Col md={6}>
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100"
                      onClick={downloadReceipt}
                    >
                      <FaDownload className="me-2" />
                      Download Receipt
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100"
                      onClick={() => navigate('/')}
                    >
                      <FaHome className="me-2" />
                      Back to Home
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Additional Information */}
            <Card className={`shadow-lg border-0 ${showAnimation ? 'animate__animated animate__fadeInUp' : ''}`} style={{ animationDelay: '0.8s' }}>
              <Card.Body className="p-4">
                <h5 className="text-primary mb-3">
                  <FaCheckCircle className="me-2" />
                  What's Next?
                </h5>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaCheckCircle className="text-success me-3" />
                      <div>
                        <strong>Confirmation Email</strong>
                        <p className="mb-0 text-muted">You'll receive a confirmation email with your booking details</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaClock className="text-primary me-3" />
                      <div>
                        <strong>Check-in Time</strong>
                        <p className="mb-0 text-muted">2:00 PM on your arrival date</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaClock className="text-danger me-3" />
                      <div>
                        <strong>Check-out Time</strong>
                        <p className="mb-0 text-muted">11:00 AM on your departure date</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaWifi className="text-info me-3" />
                      <div>
                        <strong>Free WiFi</strong>
                        <p className="mb-0 text-muted">High-speed internet included</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaParking className="text-warning me-3" />
                      <div>
                        <strong>Free Parking</strong>
                        <p className="mb-0 text-muted">Secure parking available</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="d-flex align-items-center p-3 bg-light rounded">
                      <FaCheckCircle className="text-success me-3" />
                      <div>
                        <strong>Contact Support</strong>
                        <p className="mb-0 text-muted">+91 9876543210 for special requests</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookingSuccess; 