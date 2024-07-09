# 05-redux-redux-performance-techniques-and-optimizations

(00:00) Intro
(00:36) Welcome
(00:50) Prerequisite knowledge
(01:07) Starter Code Note
(01:55) UsersList component
(03:11) selectByUserId selector
(03:58) UserPage component
(06:00) Adding user routes to App.js
(06:44) Adding a catch all route
(07:39) Add Users link in header
(08:04) Testing the user components
(09:15) Adding count state, reducer, and selector
(11:24) Adding a counter to the header
(12:30) Quick typo fix
(12:58) Optimization issue 1
(15:02) Identifying the cause of re-renders
(16:01) Creating a memoized selector
(17:50) Updating the UserPage component
(18:56) Testing our changes
(20:36) Optimization issue 2
(21:16) Solving with React.memo
(23:27) A full-featured solution
(23:51) Normalization
(24:27) Adding createEntityAdapter
(25:37) Changes to initial state
(26:17) Using entities as a lookup object
(26:49) Applying entity adapter CRUD methods
(28:51) Entity adapter generated selectors
(30:33) Reviewing postsSlice changes
(31:14) PostsList component changes
(32:17) PostsExcerpt component changes
(33:02) Testing the entity adapter changes
