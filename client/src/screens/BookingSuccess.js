import React, { useEffect, useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetchSessionDetails(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [searchParams]);

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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div>Loading...</div>
      </Container>
    );
  }

  if (error || !session) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          {error || 'Booking details not found'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="text-center">
        <h1 className="text-success">✅ Payment Successful!</h1>
        <h3>Your booking has been confirmed</h3>
        
        <div className="mt-4">
          <h4>Booking Details:</h4>
          <p><strong>Room:</strong> {session.metadata?.roomName}</p>
          <p><strong>Type:</strong> {session.metadata?.roomType}</p>
          <p><strong>Check-in:</strong> {session.metadata?.fromDate}</p>
          <p><strong>Check-out:</strong> {session.metadata?.toDate}</p>
          <p><strong>Amount:</strong> ₹{(session.amount_total / 100).toFixed(2)}</p>
          <p><strong>Status:</strong> {session.payment_status}</p>
        </div>

        <Button variant="primary" className="mt-4" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </Container>
  );
}

export default BookingSuccess; 