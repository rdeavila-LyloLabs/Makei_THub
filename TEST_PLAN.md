# TEST_PLAN.md

## 1. Unit Testing (Jest)
Focus on pure logic and utility functions.

### Scope
- **Cost Calculation Logic**:
    - Verify that budget totals are summed correctly.
    - Verify currency formatting helpers.
- **Date Utilities**:
    - Verify `isOverdue` logic for training dates.

### Example Test Case
```typescript
test('calculates total budget correctly', () => {
  const trainings = [{ cost: 100 }, { cost: 200 }];
  expect(calculateTotal(trainings)).toBe(300);
});
```

## 2. E2E Testing (Playwright)
Focus on the critical "Happy Path" for an HR Admin.

### Scenario: The "Assign Training" Flow
1. **Setup**: Authenticate as a test user with a clean organization.
2. **Action 1**: Navigate to "Employees" -> Click "Add Employee" -> Fill Form -> Submit.
    - *Expectation*: New employee appears in the table.
3. **Action 2**: Click "Assign Training" on the new employee.
4. **Action 3**: Fill details (Course: "Next.js Mastery", Cost: 500) -> Submit.
    - *Expectation*: Training count increments on Dashboard.
5. **Action 4**: Upload a mock PDF as evidence.
    - *Expectation*: File appears in the "Evidence" list.

## 3. Manual Verification Checklist
- [ ] **Responsive Design**: Check Sidebar behavior on mobile vs desktop.
- [ ] **Theming**: Verify Primary Color `#00858E` is used for primary actions.
- [ ] **Error Handling**: Try uploading an invalid file type (e.g., .exe) and verify error message.
