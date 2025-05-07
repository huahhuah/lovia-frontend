<template>
  <!-- ✅ 手機版 Footer -->
  <footer class="footer position-relative text-center">
    <div class="container py-5">
      <img src="/small-logo.png" alt="Lovia Logo" class="footer-logo mb-3" />
      <div class="social-icons mb-3">
        <a href="#" class="me-3">
          <img src="/facebook.png" alt="Facebook" />
        </a>
        <a href="#" class="me-3">
          <img src="/instagram.png" alt="Instagram" />
        </a>
        <a href="#">
          <img src="/email.png" alt="Email" />
        </a>
      </div>
      <p class="footer-privacy small text-muted">© Copyright 2025 北十有限公司</p>
    </div>
  </footer>

  <!-- ✅ 桌機版 Footer -->
  <footer class="footer-desktop py-5">
    <div class="container custom-container">
      <div class="row align-items-start">
        <div class="col-md-3 mb-4 text-center text-md-start order-md-1">
          <img src="/homepageS1-logo.png" alt="Lovia Logo" width="100" class="mb-3" />
          <div class="d-flex justify-content-center justify-content-md-start gap-3">
            <a href="#"><img src="/instagram.png" alt="Instagram" width="28" /></a>
            <a href="#"><img src="/facebook.png" alt="Facebook" width="28" /></a>
            <a href="#"><img src="/email.png" alt="Email" width="28" /></a>
          </div>
        </div>

        <div class="col-md-3 mb-4 text-center text-md-start order-md-2">
          <div class="row">
            <div class="col-6">
              <ul class="list-unstyled small">
                <li><a href="#" class="text-dark text-decoration-none">幫助</a></li>
                <li><a href="#" class="text-dark text-decoration-none">常見問題</a></li>
                <li><a href="#" class="text-dark text-decoration-none">隱私權政策</a></li>
              </ul>
            </div>
            <div class="col-6">
              <ul class="list-unstyled small">
                <li><a href="#" class="text-dark text-decoration-none">關於我們</a></li>
                <li><a href="#" class="text-dark text-decoration-none">聯絡我們</a></li>
                <li><a href="#" class="text-dark text-decoration-none">提案說明</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4 text-center text-md-start order-md-3">
          <strong>公益無時無刻在發生</strong>
          <p class="mt-2 mb-0 small">
            我們的平台是為非營利組織與公益行動者打造的橋樑，讓更多有愛心的人能夠互相支持與幫助。
            每個人都可能面臨困境，而社會的溫暖來自彼此的關懷與行動。
            在這裡，我們希望凝聚更多願意分享與付出的「給予者」，讓需要幫助的人感受到愛與希望。
            邀請您一同關注社會的每個角落，攜手推動公益，讓世界更美好！
          </p>
        </div>
      </div>
      <div class="text-center mt-4 small text-muted">© Copyright 2025 北十有限公司</div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #ffd2cf;
}

.footer-logo {
  width: 100px;
  margin-top: -0.5rem;
}

.social-icons {
  margin-top: 1rem;
}

.social-icons img {
  width: 28px;
  height: 28px;
}

.footer-privacy {
  font-size: 0.85rem;
}

@media (min-width: 769px) {
  .footer {
    display: none;
  }
}

.footer-desktop {
  background-color: #ffd2cf;
}

.custom-container {
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .footer-desktop {
    display: none;
  }
}
</style>
