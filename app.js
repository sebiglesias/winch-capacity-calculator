
function init() {
  ['vehicleGvw', 'terrainType', 'slopeAngle', 'riggingStyle'].forEach(id => {
    document.getElementById(id).addEventListener('change', calc);
    document.getElementById(id).addEventListener('input', calc);
  });
  calc();
}

function calc() {
  const gvw = parseFloat(document.getElementById('vehicleGvw').value)||6500;
  const terrain = parseFloat(document.getElementById('terrainType').value)||1.67;
  const slopeDeg = parseFloat(document.getElementById('slopeAngle').value)||0;
  const rigging = parseFloat(document.getElementById('riggingStyle').value)||1;

  // Base rule is 1.5x GVW
  const baseRule = gvw * 1.5;

  // Slope resistance = GVW * sin(slope)
  const slopeRad = (slopeDeg * Math.PI) / 180;
  const slopeResistance = gvw * Math.sin(slopeRad);

  // Total required pull force = (GVW * terrainFactor) + slopeResistance
  const totalResistance = (gvw * (terrain - 1)) + (gvw * 0.15) + slopeResistance;
  const actualLinePull = totalResistance / rigging;

  // Commercial winch sizing: 8,000, 9,500, 10,000, 12,000, 14,000 lbs
  let recSize = 10000;
  if (baseRule <= 8000) recSize = 8000;
  else if (baseRule <= 9500) recSize = 9500;
  else if (baseRule <= 10000) recSize = 10000;
  else if (baseRule <= 12500) recSize = 12000;
  else recSize = 14000;

  document.getElementById('recWinchLbs').textContent = `${recSize.toLocaleString()} lbs`;
  document.getElementById('pullLoadSummary').textContent = `Total Calculated Recovery Resistance: ${Math.round(totalResistance).toLocaleString()} lbs`;
  document.getElementById('baseRule').textContent = `${Math.round(baseRule).toLocaleString()} lbs`;
  document.getElementById('motorLoad').textContent = `${Math.round(actualLinePull).toLocaleString()} lbs`;
  document.getElementById('snatchBlockRec').textContent = rigging === 2 ? 'Double Line Active (Halves Motor Load)' : 'Use Snatch Block in Deep Mud';
}
window.addEventListener('DOMContentLoaded', init);
