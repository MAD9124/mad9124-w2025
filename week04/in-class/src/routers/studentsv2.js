// TODO if time
// app.put('/v2/:id', (req, res) => {
//   // 1 find the student
//   // const id = req.params.id;
//   const { id } = req.params;
//   const studentIdx = students.findIndex(
//     (student) => student.id === parseInt(id, 10)
//   );

//   // 1a no student - respond 404
//   if (studentIdx === -1) {
//     res.status(404).json({
//       error: `student with id ${id} not found`,
//     });
//     return;
//   }

//   // 2 get the new data from the request
//   // 3 update the data in memory
//   const { firstName, lastName } = req.body;

//   if (!firstName || !lastName) {
//     res.status(400).json({
//       error: 'firstName and lastName required',
//     });
//   }

//   students[studentIdx] = {
//     id: parseInt(id, 10),
//     firstName,
//     lastName,
//   };

//   // 4 respond accordingly
//   res.json({
//     data: students[studentIdx],
//   });
// });

// app.patch('/v2/:id', (req, res) => {
//   // 1 find the student
//   // const id = req.params.id;
//   const { id } = req.params;
//   const studentIdx = students.findIndex(
//     (student) => student.id === parseInt(id, 10)
//   );

//   // 1a no student - respond 404
//   if (studentIdx === -1) {
//     res.status(404).json({
//       error: `student with id ${id} not found`,
//     });
//     return;
//   }

//   // 2 get the new data from the request
//   // 3 update the data in memory
//   const { firstName, lastName } = req.body;
//   students[studentIdx] = {
//     ...students[studentIdx],
//     ...(firstName && { firstName }),
//     ...(lastName && { lastName }),
//   };

//   // 4 respond accordingly
//   res.json({
//     data: students[studentIdx],
//   });
// });
