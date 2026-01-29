import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/Invoice.css";

export default function Invoice() {
    const { state } = useLocation();

    if (!state) return <p>No invoice data found</p>;

    const {
        bookingId,
        bookingType,
        selectedOption,
        totalAmount,
        rooms,
        nights,
        passengers,
        travel_date,
        item,
        mobile,
        check_in,
        check_out
    } = state.bookingData;

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("TRIPLYTIC", 14, 20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Smart Travel Booking Platform", 14, 28);

        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 20);
        doc.text(`${bookingType === "HOTEL" ? `Check In: ${check_in} | Check Out: ${check_out}` : `Travel Date: ${travel_date}`}`, bookingType==="HOTEL" ? 120 : 150, 25);
        doc.text(`Mobile: ${state.bookingData.mobile || "N/A"}`, 150, 30);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 14, 45);
        // doc.text(`Invoice # : ${bookingId}`, 14, 52);

        // Table setup
        const startY = 55;
        const leftMargin = 14;
        const colWidths = bookingType === "HOTEL" ? [70, 25, 25, 35, 35] : [90, 30, 35, 35];
        const padding = 5;
        const headerHeight = 10;
        const rowPadding = 3;
        const fontSize = 10;

        doc.setFontSize(fontSize);

        // Table header
        doc.setFillColor(25, 118, 210);
        doc.rect(leftMargin, startY, 190, headerHeight, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        const headers = bookingType === "HOTEL" ? ["Description", "Rooms", "Nights", "Unit Price", "Amount"] : ["Description", "Quantity", "Unit Price", "Amount"];
        let x = leftMargin;
        headers.forEach((header, i) => {
            doc.text(header, x + padding, startY + headerHeight / 2 + 2);
            x += colWidths[i];
        });

        // Table content with wrapping
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize - 1); // Slightly smaller for desc

        const rowData = bookingType === "HOTEL"
            ? [
                item.title,
                `${rooms} room${rooms > 1 ? 's' : ''}`,
                `${nights} night${nights > 1 ? 's' : ''}`,
                `Rs.${item.unitPrice}`,
                `Rs.${totalAmount}`
            ]
            : [
                `${item.title} ${item.subtitle.split(" → ")[0]} to ${item.subtitle.split(" → ")[1]}`,
                `${passengers} passenger${passengers > 1 ? 's' : ''}`,
                `Rs.${item.unitPrice}`,
                `Rs.${totalAmount}`
            ];

        let rowY = startY + headerHeight + rowPadding;
        colWidths.forEach((width, i) => {
            const cellWidth = width - padding * 2;
            const lines = doc.splitTextToSize(rowData[i], cellWidth);
            lines.forEach((line, lineIdx) => {
                doc.text(line, leftMargin + i + (i > 0 ? colWidths.slice(0, i).reduce((a, b) => a + b, 0) : 0) + padding, rowY);
                rowY += (fontSize - 1) * 1.2; // Line height
            });
            rowY = startY + headerHeight + rowPadding; // Reset for next cell
        });
        const contentHeight = rowY + (fontSize - 1) * 1.2 - rowPadding;
        const totalTableHeight = headerHeight + contentHeight;

        doc.setDrawColor(200, 200, 200);
        doc.line(leftMargin, startY, leftMargin + 190, startY); // Top
        doc.line(leftMargin, startY + headerHeight, leftMargin + 190, startY + headerHeight); // Header bottom
        doc.line(leftMargin, startY + totalTableHeight, leftMargin + 190, startY + totalTableHeight); // Bottom
        // Vertical lines
        let lineX = leftMargin;
        colWidths.forEach(width => {
            lineX += width;
            doc.line(lineX, startY, lineX, startY + totalTableHeight);
        });

        const finalY = startY + totalTableHeight + 10;

        // Totals
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Subtotal: Rs. ${totalAmount}`, 140, finalY);

        // Line above total
        doc.line(130, finalY + 15, 195, finalY + 15);

        // Footer
        const footerY = finalY + 35;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Payment Status: PAID", 14, footerY);
        doc.text("Thank you for booking with Triplytic!", 14, footerY + 8);

        // Footer line
        doc.setDrawColor(100, 100, 100);
        doc.line(14, footerY - 5, 195, footerY - 5);

        doc.save(`Triplytic_Invoice_${bookingId}.pdf`);
    };

    return (
        <div className="invoice-container">
            <div className="success-banner">
                <h2>✅ Payment Successful!</h2>
                <p style={{ color: '#059669', fontSize: '1.1rem', margin: 0 }}>
                    Your {bookingType.toLowerCase()} booking has been confirmed
                </p>
            </div>

            <div className="invoice-card">
                <div className="invoice-header">
                    <h1 className="invoice-title">Booking Confirmation</h1>
                </div>

                {bookingType === "HOTEL" ? (
                    <div className="hotel-section">
                        <div className="invoice-detail">
                            <div>
                                <h1>🏨 {item.title}</h1>
                                {item.rating && (
                                    <span className="rating-badge">
                                        ⭐ {item.rating}
                                    </span>
                                )}
                            </div>
                            <h2>{item.location}</h2>
                        </div>

                        <div className="invoice-detail">
                            <h3>📅 Stay Duration</h3>
                            <h2>{nights} night{nights > 1 ? 's' : ''}</h2>
                        </div>

                        <div className="invoice-detail">
                            <h3>📍 Dates</h3>
                            <h2>{check_in} → {check_out}</h2>
                        </div>

                        <div className="price-breakdown">
                            <div className="breakdown-item">
                                <span>Price per night</span>
                                <span>₹{Number(item.unitPrice).toFixed(2)}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Rooms</span>
                                <span>{rooms}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Nights</span>
                                <span>{nights}</span>
                            </div>
                            <div className="breakdown-item" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                <span>Total Amount</span>
                                <span className="total-amount">₹{Number(totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flight-section">
                        <div className="invoice-detail">
                            <h1>✈️ {item.title}</h1>
                        </div>

                        <div className="invoice-detail">
                            <h3>🛫 From</h3>
                            <h2>{item.subtitle?.split(" → ")[0]}</h2>
                        </div>

                        <div className="invoice-detail">
                            <h3>🛬 To</h3>
                            <h2>{item.subtitle?.split(" → ")[1]}</h2>
                        </div>

                        <div className="invoice-detail">
                            <h3>📅 Travel Date</h3>
                            <h2>{travel_date}</h2>
                        </div>

                        <div className="price-breakdown">
                            <div className="breakdown-item">
                                <span>Price per passenger</span>
                                <span>₹{Number(item.unitPrice).toFixed(2)}</span>
                            </div>
                            <div className="breakdown-item">
                                <span>Passengers</span>
                                <span>{passengers}</span>
                            </div>
                            <div className="breakdown-item" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                <span>Total Amount</span>
                                <span className="total-amount">₹{Number(totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
                    <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>
                        Mobile: {mobile || 'N/A'}
                    </p>
                    <button onClick={downloadInvoice} className="download-btn">
                        📄 Download Invoice (PDF)
                    </button>

                    <button className="back-home-btn" onClick={() => window.location.href = '/dashboard'}>Back Home</button>
                </div>
            </div>
        </div>
    );
}
