export const CSS_CONTENT = `
.shim-pane, .shim-pane * {
  box-sizing: border-box;
}
.shim-pane {
  font-family: 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 400;
  background: linear-gradient(180deg, #22242b 0%, #1b1d23 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.45);
  line-height: 1;
  text-align: left;
  color: #e8e9ee;
  width: 300px;
  margin: 8px 0;
  user-select: none;
}
.shim-pane input {
  user-select: text;
}
.shim-pane ::-webkit-scrollbar {
  width: 8px;
}
.shim-pane ::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 4px;
}
.shim-pane-title {
  background-color: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(232,147,60,0.4);
  border-radius: 7px 7px 0 0;
  color: #e8e9ee;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  height: 28px;
  line-height: 28px;
  overflow: hidden;
  padding: 0 12px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.shim-pane-content {
  padding: 8px;
}
.shim-pane-content > * + * {
  margin-top: 6px;
}
.shim-btn {
  background-color: #2a2d35;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  color: #e8e9ee;
  cursor: pointer;
  display: block;
  font-family: 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 600;
  height: 26px;
  line-height: 24px;
  margin: 0;
  overflow: hidden;
  padding: 0 8px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.shim-btn:hover {
  background-color: #e8933c;
  border-color: #e8933c;
  color: #14161b;
}
.shim-btn:active {
  background-color: #d17f2a;
  border-color: #d17f2a;
}
.shim-folder-title {
  background-color: rgba(255,255,255,0.03);
  color: #e8e9ee;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
  padding: 0 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  border-radius: 3px;
  transition: background-color 120ms ease;
}
.shim-folder-title:hover {
  background-color: rgba(255,255,255,0.07);
}
.shim-folder-chevron {
  color: #8a8d98;
  font-size: 9px;
  flex-shrink: 0;
  transition: transform 120ms ease;
}
.shim-folder.expanded > .shim-folder-title .shim-folder-chevron {
  transform: rotate(90deg);
}
.shim-folder-content {
  border-left: 1px solid rgba(255,255,255,0.06);
  margin: 4px 0 4px 6px;
  padding: 6px 4px 6px 8px;
}
.shim-folder-content > * + * {
  margin-top: 6px;
}
.shim-input {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 22px;
  position: relative;
}
.shim-input-clickable {
  cursor: pointer;
}
.shim-input-label {
  color: #8a8d98;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  width: 38%;
}
.shim-well {
  background-color: #14161b;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 3px;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.shim-well:hover {
  border-color: rgba(255,255,255,0.14);
}
.shim-well:focus, .shim-well:focus-within {
  border-color: rgba(232,147,60,0.6);
  box-shadow: 0 0 0 1px rgba(232,147,60,0.25);
  outline: none;
}
.shim-input-number, .shim-input-text {
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 0 6px;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  text-align: left;
}
.shim-slider-wrapper {
  position: relative;
  height: 22px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}
.shim-slider-track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  margin-top: -1.5px;
  background-color: rgba(255,255,255,0.08);
  border-radius: 2px;
  pointer-events: none;
}
.shim-slider-fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 3px;
  margin-top: -1.5px;
  background-color: #e8933c;
  border-radius: 2px;
  pointer-events: none;
}
.shim-slider-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  background-color: #e8933c;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.5);
  pointer-events: none;
  transition: background-color 120ms ease;
}
.shim-slider-wrapper:hover .shim-slider-thumb {
  background-color: #f5a95c;
}
.shim-slider-value {
  display: flex;
  align-items: center;
  height: 20px;
  min-width: 34px;
  padding: 0 6px;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  flex-shrink: 0;
}
.shim-checkbox-spacer {
  flex: 1;
  display: flex;
  align-items: center;
}
.shim-checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-color: #14161b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px;
  transition: border-color 120ms ease, background-color 120ms ease;
}
.shim-input-clickable:hover .shim-checkbox-box {
  border-color: rgba(232,147,60,0.6);
}
.shim-checkbox-box.checked {
  background-color: rgba(232,147,60,0.15);
  border-color: #e8933c;
}
.shim-checkbox-check {
  display: none;
  align-items: center;
  justify-content: center;
}
.shim-checkbox-box.checked .shim-checkbox-check {
  display: flex;
}
.shim-vector-row {
  display: flex;
  flex: 1;
  gap: 4px;
  min-width: 0;
}
.shim-vector-axis {
  display: flex;
  flex: 1;
  min-width: 0;
}
.shim-vector-axis-input {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 20px;
  overflow: hidden;
}
.shim-vector-axis-label {
  color: #8a8d98;
  font-size: 10px;
  flex-shrink: 0;
  width: 12px;
  text-align: center;
  line-height: 20px;
  background-color: rgba(255,255,255,0.03);
}
.shim-vector-axis-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background-color: transparent;
  border: 0;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  padding: 0 3px;
  text-align: left;
  outline: none;
}
.shim-dropdown-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;
}
.shim-dropdown-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 20px;
  padding: 0 6px;
  user-select: none;
}
.shim-dropdown-header-value {
  flex: 1;
  min-width: 0;
  color: #e8e9ee;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.shim-dropdown-header-arrow {
  color: #8a8d98;
  font-size: 8px;
  margin-left: 4px;
  flex-shrink: 0;
}
.shim-dropdown-options {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 1000;
  background-color: #262932;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  margin-top: 2px;
  max-height: 140px;
  overflow-y: auto;
}
.shim-dropdown-options.open {
  display: block;
  animation: shim-dropdown-in 120ms ease;
}
@keyframes shim-dropdown-in {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
.shim-dropdown-option {
  padding: 5px 8px;
  cursor: pointer;
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  color: #e8e9ee;
  transition: background-color 120ms ease;
}
.shim-dropdown-option:hover {
  background-color: rgba(232,147,60,0.15);
}
.shim-dropdown-option[data-selected="true"] {
  background-color: rgba(232,147,60,0.25);
  color: #fff;
}
`;
