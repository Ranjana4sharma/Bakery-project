import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

interface UserMessage {
  id: number;
  userId: string;
  name: string;
  type: 'feedback' | 'contact' | 'complaint';
  rating?: number;
  message: string;
  adminReply?: string;
  visibleOnHome: boolean;
  timestamp: string;
}

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  imports: [CommonModule, FormsModule]
})
export class ContactComponent {
  name = '';
  message = '';
  rating: number | null = null;
  type: 'feedback' | 'contact' | 'complaint' = 'feedback';

  constructor(private authService: AuthService) {}

  submit() {
    if (!this.name.trim() || !this.message.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    if (this.type === 'feedback' && (!this.rating || this.rating < 1)) {
      alert('Please provide a rating.');
      return;
    }

    const user = this.authService.getCurrentUser();

    const newMsg: UserMessage = {
      id: Date.now(),
      userId: user ? user.username : 'guest',
      name: this.name,
      type: this.type,
      rating: this.type === 'feedback' ? this.rating || 0 : undefined,
      message: this.message,
      adminReply: undefined,
      visibleOnHome: false,
      timestamp: new Date().toISOString()
    };

    const stored = localStorage.getItem('messages');
    const msgs: UserMessage[] = stored ? JSON.parse(stored) : [];
    msgs.push(newMsg);
    localStorage.setItem('messages', JSON.stringify(msgs));

    alert('Your message has been submitted. We will get back to you soon!');

    // Reset form
    this.name = '';
    this.message = '';
    this.rating = null;
    this.type = 'feedback';
  }
}
