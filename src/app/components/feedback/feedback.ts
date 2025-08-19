import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <div class="feedback-container">
      <h2>Submit Feedback</h2>
      <form #feedbackForm="ngForm" (ngSubmit)="onSubmit(feedbackForm)" novalidate>
        <label>Name:</label>
        <input type="text" name="name" [(ngModel)]="feedback.name" required />
        <label>Email:</label>
        <input type="email" name="email" [(ngModel)]="feedback.email" required />
        <label>Message:</label>
        <textarea name="message" [(ngModel)]="feedback.message" required></textarea>

        <button type="submit" [disabled]="!feedbackForm.valid">Submit</button>
      </form>
      <div *ngIf="submitted" class="success-message">
        Thank you for your feedback!
      </div>
    </div>
  `,
  styles: [`
    .feedback-container {
      max-width: 400px;
      margin: 2rem auto;
      font-family: Arial, sans-serif;
    }
    label {
      display: block;
      margin: 0.7rem 0 0.3rem 0;
      font-weight: 600;
    }
    input, textarea {
      width: 100%;
      padding: 0.4rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    textarea {
      min-height: 100px;
    }
    button {
      margin-top: 1rem;
      padding: 0.6rem 1.2rem;
      background-color: #d2691e;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .success-message {
      margin-top: 1rem;
      color: green;
      font-weight: bold;
    }
  `]
})
export class FeedbackComponent {
  submitted = false;
  feedback = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      form.resetForm();
    }
  }
}
