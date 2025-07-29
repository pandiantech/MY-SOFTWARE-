document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cartList = document.getElementById('cart-list');
  const totalAmount = document.getElementById('total-amount');
  const discountInput = document.getElementById('discount');
  const otherChargesInput = document.getElementById('other-charges');
  const gstToggle = document.getElementById('gst-toggle');
  const gstInputs = document.getElementById('gst-inputs');
  const cgstInput = document.getElementById('cgst');
  const sgstInput = document.getElementById('sgst');
  const igstInput = document.getElementById('igst');
  const utgstInput = document.getElementById('utgst');
  const custNameInput = document.getElementById('cust-name');
  const custNumberInput = document.getElementById('cust-number');
  const paymentMethodInput = document.getElementById('payment-method');
  const invoiceDateInput = document.getElementById('invoice-date');

  let cart = JSON.parse(localStorage.getItem('billingCart')) || [];

  if (!invoiceDateInput.value) {
    invoiceDateInput.value = new Date().toISOString().slice(0, 10);
  }

  function goBack() {
    window.location.href = 'billing.html';
  }
  window.goBack = goBack;

  function renderCart() {
    if (!cartList) return;
    cartList.innerHTML = '';
    if (cart.length === 0) {
      cartList.innerHTML = '<p>No products added yet.</p>';
      updateTotal();
      return;
    }
    cart.forEach((item, i) => {
      const box = document.createElement('div');
      box.className = 'product-box';
      box.innerHTML = `
        <div><strong>${item.name}</strong></div>
        <div>Qty: <input type="number" min="1" value="${item.qty}" data-index="${i}" class="qty-input" /></div>
        <div>Rate: ₹<input type="number" min="0" step="0.01" value="${item.price.toFixed(2)}" data-index="${i}" class="rate-input" /></div>
        <div>Total: ₹${(item.qty * item.price).toFixed(2)}</div>
        <div><button data-index="${i}" class="remove-btn" aria-label="Remove product">Remove</button></div>
      `;
      cartList.appendChild(box);
    });
    attachListeners();
    updateTotal();
  }

  function attachListeners() {
    document.querySelectorAll('.qty-input').forEach(input => {
      input.onchange = e => {
        const idx = e.target.getAttribute('data-index');
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        cart[idx].qty = val;
        renderCart();
      };
    });
    document.querySelectorAll('.rate-input').forEach(input => {
      input.onchange = e => {
        const idx = e.target.getAttribute('data-index');
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < 0) val = 0;
        cart[idx].price = val;
        renderCart();
      };
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.onclick = e => {
        const idx = e.target.getAttribute('data-index');
        cart.splice(idx, 1);
        renderCart();
      };
    });
  }

  gstToggle.addEventListener('change', e => {
    gstInputs.classList.toggle('hide', !e.target.checked);
    updateTotal();
  });

  [discountInput, otherChargesInput, cgstInput, sgstInput, igstInput, utgstInput].forEach(input => {
    input.addEventListener('input', updateTotal);
  });

  invoiceDateInput.addEventListener('change', () => {});
  custNameInput.addEventListener('input', () => {});
  custNumberInput.addEventListener('input', () => {});
  paymentMethodInput.addEventListener('change', () => {});

  function updateTotal() {
    let subtotal = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
    const discount = parseFloat(discountInput.value) || 0;
    const otherCharges = parseFloat(otherChargesInput.value) || 0;

    let gstTotal = 0;
    if (gstToggle.checked) {
      const cgst = parseFloat(cgstInput.value) || 0;
      const sgst = parseFloat(sgstInput.value) || 0;
      const igst = parseFloat(igstInput.value) || 0;
      const utgst = parseFloat(utgstInput.value) || 0;
      const totalPercent = cgst + sgst + igst + utgst;
      gstTotal = (subtotal - discount) * (totalPercent / 100);
    }

   const finalTotal = subtotal - discount + otherCharges;

    totalAmount.textContent = finalTotal.toFixed(2);
  }

  function generateInvoiceHTML() {
    const date = invoiceDateInput.value || new Date().toISOString().slice(0, 10);
    const custName = custNameInput.value || '';
    const custNumber = custNumberInput.value || '';
    const paymentMethod = paymentMethodInput.value || '';
    const discount = parseFloat(discountInput.value) || 0;
    const otherCharges = parseFloat(otherChargesInput.value) || 0;

    let subtotal = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
    let gstHtml = '';
    let gstTotal = 0;

    if (gstToggle.checked) {
      const cgst = parseFloat(cgstInput.value) || 0;
      const sgst = parseFloat(sgstInput.value) || 0;
      const igst = parseFloat(igstInput.value) || 0;
      const utgst = parseFloat(utgstInput.value) || 0;
      const totalGstPercent = cgst + sgst + igst + utgst;
      gstTotal = (subtotal - discount) * (totalGstPercent / 100);

      gstHtml = `
        <tr><td>CGST (${cgst}%)</td><td>₹${(((subtotal - discount) * cgst) / 100).toFixed(2)}</td></tr>
        <tr><td>SGST (${sgst}%)</td><td>₹${(((subtotal - discount) * sgst) / 100).toFixed(2)}</td></tr>
        <tr><td>IGST (${igst}%)</td><td>₹${(((subtotal - discount) * igst) / 100).toFixed(2)}</td></tr>
        <tr><td>UTGST (${utgst}%)</td><td>₹${(((subtotal - discount) * utgst) / 100).toFixed(2)}</td></tr>
      `;
    }

    const total = subtotal - discount + gstTotal + otherCharges;

    return `
      <div style="font-family:'Quicksand',sans-serif; font-size:12px; max-width:280px; padding:10px;">
        <h2 style="text-align:center; color:#fbc02d; margin-bottom:10px;">Pandian Tech Service</h2>
        <p>Date: ${date}</p>
        <p>Customer: ${custName}</p>
        <p>Phone: ${custNumber}</p>
        <p>Payment Method: ${paymentMethod}</p>

        <table style="width:100%; border-collapse: collapse; margin-top:10px;">
          <thead>
            <tr style="border-bottom:1px solid #ddd;">
              <th style="text-align:left;">Product</th>
              <th style="text-align:right;">Qty</th>
              <th style="text-align:right;">Rate</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(i => `
              <tr>
                <td>${i.name}</td>
                <td style="text-align:right;">${i.qty}</td>
                <td style="text-align:right;">₹${i.price.toFixed(2)}</td>
                <td style="text-align:right;">₹${(i.qty * i.price).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="text-align:right;">Subtotal</td>
              <td style="text-align:right;">₹${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right;">Discount</td>
              <td style="text-align:right;">₹${discount.toFixed(2)}</td>
            </tr>
            ${gstHtml}
            <tr>
              <td colspan="3" style="text-align:right;">Other Charges</td>
              <td style="text-align:right;">₹${otherCharges.toFixed(2)}</td>
            </tr>
            <tr style="font-weight:bold; border-top:1px solid #000;">
              <td colspan="3" style="text-align:right;">Total</td>
              <td style="text-align:right;">₹${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <p style="text-align:center; margin-top:15px;">Thank you for your business!</p>
      </div>
    `;
  }

  const modal = document.getElementById('invoice-modal');
  const previewContent = document.getElementById('invoice-preview-content');
  document.getElementById('close-preview').onclick = () => {
    modal.style.display = 'none';
  };
  window.onclick = e => {
    if (e.target === modal) modal.style.display = 'none';
  };

  window.previewInvoice = () => {
    previewContent.innerHTML = generateInvoiceHTML();
    modal.style.display = 'flex';
  };

  window.printInvoice = () => {
    const printWindow = window.open('', '', 'width=300,height=600');
    printWindow.document.write(`<html><head><title>Invoice</title><style>
      body { font-family: 'Quicksand', sans-serif; font-size: 12px; padding: 10px; max-width: 280px; }
      h2 { text-align:center; color:#fbc02d; margin-bottom:10px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px;}
      table th, table td { border-bottom: 1px solid #ddd; padding: 4px 0; }
      table th { text-align:left; }
      table td { text-align:right; }
    </style></head><body>`);
    printWindow.document.write(generateInvoiceHTML());
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ✅ Rewritten Save as PDF
  window.saveInvoice = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      unit: 'pt',
      format: [144, 432]
    });

    const container = document.createElement('div');
    container.innerHTML = generateInvoiceHTML();

    doc.html(container, {
      callback: function (doc) {
        const custNumber = custNumberInput.value.trim() || 'unknown';
        const date = invoiceDateInput.value || new Date().toISOString().slice(0, 10);
        doc.save(`Bill_${custNumber}_${date}.pdf`);
      },
      x: 10,
      y: 10,
      width: 120,
      windowWidth: 300
    });
  };

  window.shareInvoice = () => {
    let msg = `*Invoice*\nDate: ${invoiceDateInput.value}\nCustomer: ${custNameInput.value}\nPhone: ${custNumberInput.value}\nPayment: ${paymentMethodInput.value}\n\nItems:\n`;
    cart.forEach(i => {
      msg += `- ${i.name} x${i.qty} @ ₹${i.price.toFixed(2)} = ₹${(i.qty * i.price).toFixed(2)}\n`;
    });
    const discount = parseFloat(discountInput.value) || 0;
    const otherCharges = parseFloat(otherChargesInput.value) || 0;
    msg += `\nDiscount: ₹${discount.toFixed(2)}\nOther Charges: ₹${otherCharges.toFixed(2)}\n`;
    if (gstToggle.checked) {
      msg += 'GST Applied:\n';
      msg += `CGST: ${parseFloat(cgstInput.value) || 0}%\n`;
      msg += `SGST: ${parseFloat(sgstInput.value) || 0}%\n`;
      msg += `IGST: ${parseFloat(igstInput.value) || 0}%\n`;
      msg += `UTGST: ${parseFloat(utgstInput.value) || 0}%\n`;
    }
    msg += `\n*Total: ₹${totalAmount.textContent}*\n\nThank you for your business!`;

    const url = `https://wa.me/7200171230?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  renderCart();
  updateTotal();
});
