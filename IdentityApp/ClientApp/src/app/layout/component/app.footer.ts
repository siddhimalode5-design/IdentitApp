import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<footer class="app-footer">
  <div class="footer-content">
    <span class="footer-brand">IdentityApp</span>
    <span class="footer-desc">Secure Authentication & Identity Management</span>
  </div>

  <div class="footer-links">
    <a href="#" class="footer-link">Privacy Policy</a>
    <a href="#" class="footer-link">Terms</a>
    <a href="#" class="footer-link">Support</a>
  </div>

  <div class="footer-copy">
    © {{ currentYear }} IdentityApp. All Rights Reserved.
  </div>
</footer>
`,
styles: [
    `
      .app-footer {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 18px 0;
  text-align: center;
  color: #374151;
  margin-top: 40px;
  font-family: "Segoe UI", Roboto, sans-serif;
}

.footer-content {
  margin-bottom: 6px;
}

.footer-brand {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  display: block;
}

.footer-desc {
  color: #6b7280;
  font-size: 0.90rem;
}

.footer-links {
  margin: 8px 0;
}

.footer-link {
  margin: 0 12px;
  text-decoration: none;
  color: #3b82f6;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
  color: #2563eb;
}

.footer-copy {
  font-size: 0.80rem;
  color: #6b7280;
}

    `
  ]

})
export class AppFooter {
    currentYear: number = new Date().getFullYear();
}
