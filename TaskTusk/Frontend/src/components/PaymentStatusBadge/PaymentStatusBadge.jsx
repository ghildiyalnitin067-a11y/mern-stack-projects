import React from 'react'
import { Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'
import './PaymentStatusBadge.css'

const PaymentStatusBadge = ({ status }) => {
  let config = {
    text: 'Pending',
    className: 'badge-pending',
    icon: <Clock size={12} />
  }

  if (status === 'paid') {
    config = {
      text: 'Paid',
      className: 'badge-paid',
      icon: <CheckCircle2 size={12} />
    }
  } else if (status === 'failed') {
    config = {
      text: 'Payment Failed',
      className: 'badge-failed',
      icon: <ShieldAlert size={12} />
    }
  } else if (status === 'refunded') {
    config = {
      text: 'Refunded',
      className: 'badge-refunded',
      icon: <AlertTriangle size={12} />
    }
  }

  return (
    <span className={`payment-status-badge ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </span>
  )
}

export default PaymentStatusBadge
