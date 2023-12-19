```sh
urlpatterns = [
    path('profile_posts/', views.profile_posts),
    path('following_posts/', views.following_posts),
    path('user/', views.user),
    path('getFollow/<int:user_id>/', views.getFollow),
    path('follow/<int:user_id>/', views.follow),
    path('getPostComments/<int:post_id>/', views.getPostComments),
    path('comment/<int:post_id>/', views.comment),
    path('getLike/<int:post_id>/', views.getLike),
    path('like/<int:post_id>/', views.like),
    path('post_user_comment/<int:post_id>/', views.post_user_comment),
]
```

```sh
# from ast import Try
import math
from icecream import ic
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication
from .serializers import UserSerializer
from .models import User, Post, Follow, Comment, Like
from django.core.paginator import Paginator
from rest_framework.parsers import FileUploadParser
# from rest_framework.authtoken.models import Token


@api_view(['GET'])
@permission_classes([AllowAny])
def getPosts(request):
    if request.method == 'GET':
        page = int(request.GET.get('page') or 1)
        # ic(request.host)
        ic(page)
        ic(request.get_host())
        try:
            # image url cannot get by values() method, so add another attribute to models field
            all_posts = Post.objects.all().values(
                'id', 'status', 'user__username', 'user__id', 'user__avatar', 'user__avatar_url', 'image_url', 'image', 'timestamp')
        except Post.DoesNotExist:
            return Response({'status': False, 'detail': 'Cannot get posts'}, status=status.HTTP_404_NOT_FOUND)

        posts_length = len(all_posts)
        num_of_pages = math.ceil(posts_length/10)
        pagination = Paginator(all_posts, 10)
        posts = pagination.page(page).object_list
        # ic(posts)

        return Response({
            'posts': posts,
            'totalPosts': posts_length,
            "numOfPages": num_of_pages,
        }, status=status.HTTP_200_OK)


@api_view(['POST', 'DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def posts(request):
    if request.method == 'POST':
        # ic(request.user.username)
        data = request.data
        post_status = data.get('status')
        # user_id = data.get('user')
        image = data.get('image')
        ic(image)
        user = request.user
        if not image:
            # Not image means using default image
            # image.url is correct only after image is saved to database. 
            # So save create object first, then edit image instance later
            a = Post(user=user, status=post_status)
            a.save()
            a.id
            b = Post.objects.get(id = a.id)
            b.image_url = a.image.url
            b.save()

        else:
            # image.url is correct only after image is saved to database. 
            # So save create object first, then edit image instance later
            a = Post(user=user, status=post_status, image=image)
            a.save()
            a.id
            b = Post.objects.get(id = a.id)
            b.image_url = a.image.url
            b.save()
        return Response({'status': True, 'detail': 'create post success'}, status=status.HTTP_200_OK)

    if request.method == 'PATCH':
        data = request.data
        post_id = int(data.get('postId'))
        post_status = data.get('status')
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'status': False, 'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        post.status = post_status
        post.save()

        return Response(status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        post_id = int(request.GET.get('postId'))
        try:
            Post.objects.get(id=post_id).delete()
        except Post.DoesNotExist:
            return Response({'status': False, 'detail': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'status': True, 'detail': 'Post deleted'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def post(request, post_id):
    try:
        # get cannot use values(), so need to use filter, it will return an array of object
        post = Post.objects.filter(id=post_id).values(
            'id', 'status', 'user__username', 'user__id', 'user__avatar', 'user__avatar_url', 'image', 'image_url', 'timestamp')
    except Post.DoesNotExist:
        return Response({'status': False, 'detail': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'post': post[0]}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def profile_posts(request):
    page = int(request.GET.get('page') or 1)
    profile_name = request.GET.get('profileName')
    try:
        an_user = User.objects.get(username=profile_name)
    except User.DoesNotExist:
        return Response({'status': True, 'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        all_posts = Post.objects.filter(user=an_user).values(
            'id', 'status', 'user__username', 'user__info', 'user__id', 'user__avatar', 'user__avatar_url', 'image', 'image_url', 'timestamp')
    except Post.DoesNotExist:
        return Response({'status': False, "detail": "User don't have any post yet."}, status=status.HTTP_404_NOT_FOUND)

    # get follow states
    try:
        follow_obj, created = Follow.objects.prefetch_related(
            'following').get_or_create(user=an_user)
        follow = follow_obj.following
    except Follow.DoesNotExist:
        return Response({'status': False, "detail": "Follow object does not exist."}, status=status.HTTP_404_NOT_FOUND)

    is_follow = False
    if request.user.is_authenticated:
        if an_user != request.user:
            try:
                users_following_obj, created = Follow.objects.prefetch_related(
                    'following').get_or_create(user=request.user)
                is_follow = users_following_obj.following.contains(an_user)
            except Follow.DoesNotExist:
                return Response({'status': False, "detail": "Follow object does not exist."}, status=status.HTTP_404_NOT_FOUND)

    profile_user = {
        'id': an_user.id,
        'username': an_user.username,
        'avatar': an_user.avatar.url,
        'avatar_url': an_user.avatar_url,
        # 'avatar': str(an_user.avatar).replace('/instagram/media/', ''),
        'info': an_user.info
    }

    followers = an_user.following.count()
    following = follow.count()

    posts_length = len(all_posts)
    num_of_pages = math.ceil(posts_length/10)
    pagination = Paginator(all_posts, 10)
    posts = pagination.page(page).object_list
    # ic(post_data)

    return Response({
        'profilePosts': posts,
        'totalProfilePosts': posts_length,
        "numOfProfilePages": num_of_pages,
        'isFollow': is_follow,
        'followers': followers,
        'following': following,
        'profileUser': profile_user,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def following_posts(request):
    page = int(request.GET.get('page') or 1)

    follow_obj, is_created = Follow.objects.get_or_create(user=request.user)

    users_following = Follow.objects.get(user=request.user).following.all()
    if not users_following:
        return Response({
            'status': False,
            "detail": "User haven't followed anybody yet",
        }, status=status.HTTP_404_NOT_FOUND)
    else:
        following_posts = Post.objects.filter(
            user__in=users_following).values(
            'id', 'status', 'user__username', 'user__id', 'user__avatar', 'user__avatar_url', 'image', 'image_url', 'timestamp')

        posts_length = len(following_posts)
        num_of_pages = math.ceil(posts_length/10)
        pagination = Paginator(following_posts, 10)
        posts = pagination.page(page).object_list

        return Response({
            'posts': posts,
            'totalPosts': posts_length,
            "numOfPages": num_of_pages,
        }, status=status.HTTP_200_OK)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user(request):
    current_user = request.user
    # ic(current_user)
    if request.method == 'GET':
        # request.user only work when have token Authorization
        user = {
            'id': current_user.id,
            'username': current_user.username,
            'avatar': current_user.avatar.url,
            'avatar_url': current_user.avatar_url,
            # 'avatar': str(current_user.avatar).replace('/instagram/media/', ''),
            # 'info': current_user.info,
        }

        return Response(user, status=status.HTTP_200_OK)

    if request.method == 'PATCH':
        """Update Avatar"""

        data = request.data
        image = data.get('avatar')
        currentUser = User.objects.get(id=current_user.id)
        # ic(image)
        if image:
            currentUser.avatar = image
            currentUser.save()

        newUser = User.objects.get(id=current_user.id)
        user = {
            'id': newUser.id,
            'username': newUser.username,
            # 'avatar': newUser.avatar.url.replace('/instagram/media/', ''),
            'avatar': newUser.avatar.url,
            'avatar_url': newUser.avatar_url,
            # 'info': newUser.info,
        }

        return Response(user, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def getFollow(request, user_id):
    try:
        an_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'status': False, 'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    is_follow = False

    is_authenticated = request.user.is_authenticated
    if is_authenticated:
        if an_user != request.user:
            users_following_obj, created = Follow.objects.get_or_create(
                user=request.user)
            is_follow = users_following_obj.following.contains(an_user)

    if request.method == "GET":
        return Response({
            "isFollow": is_follow,
        }, status=status.HTTP_200_OK)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def follow(request, user_id):
    try:
        an_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'status': False, 'detail': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if an_user != request.user:
        users_following_obj, created = Follow.objects.get_or_create(
            user=request.user)
        is_follow = users_following_obj.following.contains(an_user)
    else:
        is_follow = False
    
    # Update follow condition
    if request.method == "PATCH":
        users_following = Follow.objects.get(user=request.user).following
        if not is_follow:
            users_following.add(user_id)
            return Response({"isFollow": True}, status=status.HTTP_201_CREATED)
        else:
            users_following.remove(user_id)
            return Response({"isFollow": False}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def getPostComments(request, post_id):
    try:
        post = Post.objects.prefetch_related('comments').get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Get comments
    if request.method == "GET":
        comments = post.comments.all().values(
            'id', 'post', 'content', 'user__username', 'user__id', 'user__avatar', 'user__avatar_url', 'timestamp')

        return Response(comments, status=status.HTTP_200_OK)


@api_view(['POST', 'PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def comment(request, post_id):
    try:
        post = Post.objects.prefetch_related('comments').get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # Post comment
    if request.method == "POST":

        data = request.data
        content = data["comment"]

        # Check if blank
        if content.strip():
            # Add comment to database
            Comment.objects.create(
                content=content, user=request.user, post=post)
            return Response({'status': True, "message": "Your comment has been added"}, status=status.HTTP_201_CREATED)
        else:
            return Response({'status': False, "detail": "Cannot leave comment blank"}, status=status.HTTP_400_BAD_REQUEST)

    # Update comment
    if request.method == "PATCH":
        data = request.data
        commentId = data["id"]

        try:
            comment = Comment.objects.only('content').get(
                id=commentId)
        except Comment.DoesNotExist:
            return Response({'status': False, "detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        content = data["comment"]

        # Check if contents is blank
        if content.strip():
            comment.content = content
            comment.save()
        else:
            return Response({'status': False, "detail": "Cannot leave comment blank"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([TokenAuthentication])
def post_user_comment(request, post_id):
    try:
        comments = Comment.objects.select_related(
            'id', 'content', "user__username").filter(
            post=post_id, user=request.user).all()
    except User.DoesNotExist:
        return Response({'status': False, "detail": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)

    post_user_comment = comments.values(
        'id', 'content', "user__username")

    # ic(post_user_comment)
    return Response(post_user_comment, status=status.HTTP_200_OK)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def getLike(request, post_id):
    """
    For unauthenticated users see posts likes
    """
    try:
        post = Post.objects.prefetch_related('likes').get(id=post_id)
    except Post.DoesNotExist:
        return Response({'status': False, "detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)
    is_authenticated = request.user.is_authenticated
    # ic('auth',request.auth)
    # ic(is_authenticated)

    # Get like condition
    if request.method == "GET":
        try:
            like_sum = Like.objects.filter(post=post_id, is_like=True).count()
        except Post.DoesNotExist:
            return Response({'status': False, "detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        if is_authenticated is False:
            # ic('Not authenticated')
            return Response({"isLike": False, "likeSum": like_sum}, status=status.HTTP_201_CREATED)

        # Logged in
        post_obj, created = post.likes.get_or_create(user=request.user)

        return Response({"isLike": post_obj.is_like, "likeSum": like_sum}, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def like(request, post_id):
    # try:
    #     post = Post.objects.get(id=post_id)
    # except Post.DoesNotExist:
    #     return Response({'status': False, "detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # post_obj, created = post.likes.get_or_create(user=request.user)

    if request.method == "PATCH":
        data = request.data
        try:
            like = Like.objects.get(post=post_id, user=request.user)
        except Like.DoesNotExist:
            return Response({'status': False, "detail": "Like not found."}, status=status.HTTP_404_NOT_FOUND)
        like.is_like = data['isLike']
        like.save()

        try:
            like_sum = Like.objects.filter(post=post_id, is_like=True).count()
        except Post.DoesNotExist:
            return Response({'status': False, "detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({'status': True, 'isLike': data["isLike"], 'likeSum': like_sum}, status=status.HTTP_200_OK)

```
