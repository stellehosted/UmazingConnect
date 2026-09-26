"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Users,
  FileText,
  Plus,
  Trash2,
  Crown,
  UserMinus,
  Building,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"

interface Club {
  id: string
  name: string
  description: string
  category: string
  image_url: string | null
  is_claimed: boolean
  president_id: string | null
  president_name: string | null
  member_count: number
}

interface Post {
  id: string
  content: string
  image_url: string | null
  club_id: string
  club_name: string
  club_avatar: string | null
  author_id: string
  author_name: string
  author_avatar: string | null
  likes_count: number
  created_at: string
}

interface ClubMember {
  id: string
  user_id: string
  name: string
  email: string
  avatar_url: string | null
  role: string
  joined_at: string
}

const CATEGORIES = [
  { value: "academic", label: "Academic" },
  { value: "arts", label: "Arts" },
  { value: "sports", label: "Sports" },
  { value: "technology", label: "Technology" },
  { value: "service", label: "Service" },
  { value: "hobby", label: "Hobby" },
]

export function AdminDashboard({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("clubs")
  const [clubs, setClubs] = useState<Club[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Create club dialog
  const [showCreateClub, setShowCreateClub] = useState(false)
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    category: "academic",
    meetingTime: "",
    location: "",
  })
  const [creatingClub, setCreatingClub] = useState(false)

  // Delete post dialog
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deletingPost, setDeletingPost] = useState(false)

  // Membership management
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<ClubMember | null>(null)
  const [removingMember, setRemovingMember] = useState(false)

  const loadClubs = async () => {
    try {
      const response = await fetch("/api/clubs")
      if (response.ok) {
        const data = await response.json()
        setClubs(data.data || [])
      }
    } catch (error) {
      console.error("Error loading clubs:", error)
    }
  }

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/feed?limit=50")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    await Promise.all([loadClubs(), loadPosts()])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadClubMembers = async (clubId: string) => {
    setLoadingMembers(true)
    try {
      const response = await fetch(`/api/clubs/${clubId}/members`)
      if (response.ok) {
        const data = await response.json()
        setClubMembers(data.data || [])
      }
    } catch (error) {
      console.error("Error loading members:", error)
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleCreateClub = async () => {
    if (!newClub.name || !newClub.description || !newClub.category) {
      alert("Please fill in all required fields")
      return
    }

    setCreatingClub(true)
    try {
      const response = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClub),
      })

      if (response.ok) {
        alert("Club created successfully!")
        setShowCreateClub(false)
        setNewClub({
          name: "",
          description: "",
          category: "academic",
          meetingTime: "",
          location: "",
        })
        await loadClubs()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to create club")
      }
    } catch (error) {
      console.error("Error creating club:", error)
      alert("Failed to create club")
    } finally {
      setCreatingClub(false)
    }
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    setDeletingPost(true)
    try {
      const response = await fetch(
        `/api/posts/${postToDelete.id}?userId=${userId}`,
        { method: "DELETE" }
      )

      if (response.ok) {
        alert("Post deleted successfully!")
        setPostToDelete(null)
        await loadPosts()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post")
    } finally {
      setDeletingPost(false)
    }
  }

  const handleRemovePresident = async () => {
    if (!memberToRemove || !selectedClub) return

    setRemovingMember(true)
    try {
      // Remove from club_members and update club
      const response = await fetch(
        `/api/admin/clubs/${selectedClub.id}/remove-president`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            targetUserId: memberToRemove.user_id,
          }),
        }
      )

      if (response.ok) {
        alert("President removed and club is now unclaimed!")
        setMemberToRemove(null)
        await loadClubs()
        await loadClubMembers(selectedClub.id)
      } else {
        const data = await response.json()
        alert(data.error || "Failed to remove president")
      }
    } catch (error) {
      console.error("Error removing president:", error)
      alert("Failed to remove president")
    } finally {
      setRemovingMember(false)
    }
  }

  const handleKickMember = async (member: ClubMember) => {
    if (!selectedClub) return

    if (!confirm(`Are you sure you want to remove ${member.name} from ${selectedClub.name}?`)) {
      return
    }

    try {
      const response = await fetch(
        `/api/admin/clubs/${selectedClub.id}/kick-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            targetUserId: member.user_id,
          }),
        }
      )

      if (response.ok) {
        alert("Member removed successfully!")
        await loadClubMembers(selectedClub.id)
        await loadClubs()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to remove member")
      }
    } catch (error) {
      console.error("Error kicking member:", error)
      alert("Failed to remove member")
    }
  }

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPosts = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.club_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-8 pt-[calc(2rem+env(safe-area-inset-top))]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Settings className="h-8 w-8 text-purple-600 hidden sm:block" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage clubs, posts, and memberships
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{clubs.length}</p>
              <p className="text-sm text-muted-foreground">Total Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {clubs.filter((c) => c.is_claimed).length}
              </p>
              <p className="text-sm text-muted-foreground">Claimed Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {clubs.filter((c) => !c.is_claimed).length}
              </p>
              <p className="text-sm text-muted-foreground">Unclaimed Clubs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Recent Posts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clubs, posts, or members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clubs" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Clubs</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="memberships" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Clubs Tab */}
        <TabsContent value="clubs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">All Clubs ({filteredClubs.length})</h2>
            <Button onClick={() => setShowCreateClub(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Club
            </Button>
          </div>

          <div className="grid gap-3">
            {filteredClubs.map((club) => (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={club.image_url || "/placeholder.svg"}
                      alt={club.name}
                      className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/clubs/${club.id}`}>
                          <h3 className="font-semibold hover:underline">{club.name}</h3>
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {club.category}
                        </Badge>
                        {club.is_claimed ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Claimed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Unclaimed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {club.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {club.member_count} members
                        </span>
                        {club.president_name && (
                          <span className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            {club.president_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Posts ({filteredPosts.length})</h2>

          <div className="grid gap-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{post.author_name}</p>
                          <p className="text-xs text-muted-foreground">
                            in {post.club_name} •{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setPostToDelete(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm line-clamp-2">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Post"
                          className="mt-2 rounded-lg max-h-32 object-cover"
                        />
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {post.likes_count} likes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPosts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No posts found</p>
            )}
          </div>
        </TabsContent>

        {/* Memberships Tab */}
        <TabsContent value="memberships" className="space-y-4">
          <h2 className="text-lg font-semibold">Club Membership Management</h2>
          <p className="text-sm text-muted-foreground">
            Select a club to view and manage its members. You can remove presidents to make a club unclaimed.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Club Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Club</CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto space-y-2">
                {filteredClubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => {
                      setSelectedClub(club)
                      loadClubMembers(club.id)
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedClub?.id === club.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={club.image_url || "/placeholder.svg"}
                        alt={club.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{club.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {club.member_count} members •{" "}
                          {club.is_claimed ? "Claimed" : "Unclaimed"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedClub ? `${selectedClub.name} Members` : "Members"}
                </CardTitle>
                {selectedClub && (
                  <CardDescription>
                    {selectedClub.is_claimed
                      ? "Remove the president to make this club unclaimed"
                      : "This club is currently unclaimed"}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {!selectedClub ? (
                  <p className="text-center text-muted-foreground py-8">
                    Select a club to view members
                  </p>
                ) : loadingMembers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : clubMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No members in this club
                  </p>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {clubMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={member.role === "president" ? "default" : "outline"}
                                className="text-xs"
                              >
                                {member.role === "president" && (
                                  <Crown className="h-3 w-3 mr-1" />
                                )}
                                {member.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {member.role === "president" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setMemberToRemove(member)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleKickMember(member)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Club Dialog */}
      <Dialog open={showCreateClub} onOpenChange={setShowCreateClub}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Club</DialogTitle>
            <DialogDescription>
              Add a new club to the platform. It will be unclaimed until a student claims it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Club Name *</label>
              <Input
                value={newClub.name}
                onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                placeholder="e.g., Chess Club"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={newClub.description}
                onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                placeholder="Describe what this club is about..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category *</label>
              <Select
                value={newClub.category}
                onValueChange={(value) => setNewClub({ ...newClub, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Meeting Time</label>
              <Input
                value={newClub.meetingTime}
                onChange={(e) => setNewClub({ ...newClub, meetingTime: e.target.value })}
                placeholder="e.g., Tuesdays at 3:30 PM"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={newClub.location}
                onChange={(e) => setNewClub({ ...newClub, location: e.target.value })}
                placeholder="e.g., Room 201"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateClub(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClub} disabled={creatingClub}>
              {creatingClub ? "Creating..." : "Create Club"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post by {postToDelete?.author_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {postToDelete && (
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p className="line-clamp-3">{postToDelete.content}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={deletingPost}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingPost ? "Deleting..." : "Delete Post"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove President Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Remove President
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.name} as president of {selectedClub?.name}?
              <br /><br />
              <strong>This will:</strong>
              <ul className="list-disc ml-4 mt-2">
                <li>Remove them from the club entirely</li>
                <li>Make the club unclaimed (no president)</li>
                <li>Allow another student to claim the club</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemovePresident}
              disabled={removingMember}
              className="bg-destructive hover:bg-destructive/90"
            >
              {removingMember ? "Removing..." : "Remove President"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
