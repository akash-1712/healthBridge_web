import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PageLayout from './ui/PageLayout';
import Card from './ui/Card';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import EmptyState from './ui/EmptyState';
import Badge from './ui/Badge';
import { buildApiUrl } from '../util/api';

export default function SelectChild() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [childrenList, setChildrenList] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    fetchChildrenList();
  }, [user, token]);

  const fetchChildrenList = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        buildApiUrl('getChildrenList') + '?' +
        new URLSearchParams({
          userId: user.id,
        }).toString(),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error('Unable to retrieve the child list. Please try again.');
      } else {
        setChildrenList(data.childrenList || []);
      }
    } catch {
      toast.error('Network or server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = (child) => {
    navigate('/input-symptoms', {
      state: {
        userId: user.id,
        childId: child._id,
        childInfo: child,
      },
    });
  };

  const handleAddChild = () => {
    navigate('/add-child', {
      state: { userId: user.id },
    });
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-text-primary mt-2">Select Child</h1>
            <p className="text-text-secondary mt-1">Choose a child to start a medical consultation</p>
          </div>
          <Button variant="success" size="lg" onClick={handleAddChild}>
            <span aria-hidden="true">➕</span>
            Add New Child
          </Button>
        </div>

        {/* Children List or Empty State */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="elevated" padding="lg" className="animate-pulse">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto animate-pulse" />
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mx-auto animate-pulse" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        ) : childrenList.length === 0 ? (
          <EmptyState
            illustration="👶"
            title="No Children Added"
            description="Add your first child to start a medical visit"
            action={handleAddChild}
            actionLabel="Add Your First Child"
            variant="large"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {childrenList.map((child) => (
              <Card
                key={child._id}
                variant="interactive"
                padding="lg"
                onClick={() => handleChildSelect(child)}
                className="text-center"
              >
                <Avatar
                  name={child.name}
                  size="xl"
                  className="mx-auto mb-4"
                >
                  {child.gender === 'female' ? '👧' : '👦'}
                </Avatar>

                <h3 className="font-semibold text-text-primary text-lg mb-1">
                  {child.name}
                </h3>
                {child.age && (
                  <p className="text-text-secondary text-sm mb-2">
                    Age: {child.age} years
                  </p>
                )}
                {child.gender && (
                  <Badge variant="info" size="sm">
                    {child.gender === 'female' ? 'Girl' : 'Boy'}
                  </Badge>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
