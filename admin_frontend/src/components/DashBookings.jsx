import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function DashBookings() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [showMore, setShowMore] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/admin/getallbookings`);
        const data = await res.json();
        if (res.ok) {
          setBookings(data.bookings);
          if (data.bookings.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = bookings.length;
    try {
      const res = await fetch(`/admin/getallbookings?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) => [...prev, ...data.bookings]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

//   const handleDeleteUser = async () => {
//     try {
//         const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
//             method: 'DELETE',
//         });
//         const data = await res.json();
//         if (res.ok) {
//             setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
//             setShowModal(false);
//         } else {
//             console.log(data.message);
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
//   };
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && bookings.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell className='text-center'>Booked On</Table.HeadCell>
              <Table.HeadCell className='text-center'>Patient Name</Table.HeadCell>
              <Table.HeadCell className='text-center'>Patient ID</Table.HeadCell>
              <Table.HeadCell className='text-center'>Psyc Name</Table.HeadCell>
              <Table.HeadCell className='text-center'>Psyc ID</Table.HeadCell>
              <Table.HeadCell className='text-center'>Slot</Table.HeadCell>
              <Table.HeadCell className='text-center'>Amount</Table.HeadCell>
            </Table.Head>
            {bookings.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.userId}</Table.Cell>
                  <Table.Cell>{user.psycname}</Table.Cell>
                  <Table.Cell>{user.psychologistId}</Table.Cell>
                  <Table.Cell>{user.slot}</Table.Cell>
                  <Table.Cell className='text-center'>{user.amount}</Table.Cell>
                  
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}