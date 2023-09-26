from .models import *
import os
import random

from django.core.files.storage import default_storage
from django.core.mail import send_mail
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .models import Book
from .models import Category
from .serializers import BookDetailSerializer, SignupSerializer
from django.conf import settings


def download_all_ebook_pdfs():
    # Get all Book instances
    books = Book.objects.all()

    # Directory to save the PDFs
    save_directory = "downloaded_pdfs"

    # Create the directory if it doesn't exist
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # Loop through each book
    for book in books:
        pdf_name = f"{book.title}.pdf"
        pdf_path = os.path.join("ebooks", str(book.id), pdf_name)

        # Check if the file exists in storage
        if default_storage.exists(pdf_path):
            # If it does, open and save the file
            with default_storage.open(pdf_path, 'rb') as pdf_file:
                with open(os.path.join(save_directory, pdf_name), 'wb') as local_file:
                    local_file.write(pdf_file.read())

@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all().values('id', 'name')
    return JsonResponse(list(categories), safe=False)


@api_view(['GET'])
def book_list(request):
    categories = Category.objects.all()
    data = {}

    for category in categories:
        books_in_category = Book.objects.filter(category=category)[:10]

        if books_in_category.exists():
            book_list = []
            for book in books_in_category:
                # Check if book has a cover_image before accessing its URL
                cover_image_url = request.build_absolute_uri(book.cover_image.url) if book.cover_image else None
                book_list.append({
                    'id': book.id,
                    'title': book.title,
                    'cover_image': cover_image_url
                })

            data[category.name] = book_list

    return JsonResponse(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def book_detail(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)

    serializer = BookDetailSerializer(book, context={'request': request})

    return Response(serializer.data)



@api_view(['POST'])
def contact_us(request):


    if request.method == 'POST':
        email = request.data['email']
        name = request.data['name']
        message = request.data['message']

        Contact.objects.create(email=email, name=name, message=message)
        download_all_ebook_pdfs()

        return JsonResponse({'status': 'success'}, status=200)
    return JsonResponse({'status': 'bad request'}, status=400)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def category_books(request, category_id):
    # Fetch the category using ID
    category_ = get_object_or_404(Category, id=category_id)

    # Get books for the fetched category
    books_in_category = Book.objects.filter(category=category_).order_by('-created_at')

    # Paginate the results
    paginator = Paginator(books_in_category, 20)
    page = request.GET.get('page', 1)
    current_page_books = paginator.get_page(page)

    # Create serialized data list
    serialized_data = []
    for book in current_page_books:
        serialized_data.append({
            'id': book.id,
            'title': book.title,
            'cover_image': request.build_absolute_uri(book.cover_image.url) if book.cover_image else None
        })

    return JsonResponse(serialized_data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_books(request):
    query = request.GET.get('query', '')
    search_type = request.GET.get('type', 'book')

    if search_type == 'book':
        books = Book.objects.filter(title__icontains=query).order_by('-created_at')
    elif search_type == 'author':
        books = Book.objects.filter(author__icontains=query).order_by('-created_at')
    elif search_type == 'publisher':
        books = Book.objects.filter(publisher__icontains=query).order_by('-created_at')
    else:
        return JsonResponse({"error": "Invalid search type"}, status=400)

    # Paginate the results just like the favorites view
    paginator = Paginator(books, 20)  # Here 20 books per page, adjust as needed
    page = request.GET.get('page', 1)
    current_page_books = paginator.get_page(page)

    # Serialize the data
    serialized_data = [{
        'id': book.id,
        'title': book.title,
        'cover_image': request.build_absolute_uri(book.cover_image.url) if book.cover_image else None
    } for book in current_page_books]

    return JsonResponse(serialized_data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_book_note(request, book_id):
    # Access the authenticated user directly
    user = request.user

    # First, check if the book with the given book_id exists
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update or create the note
    note, created = Note.objects.update_or_create(user=user, book=book, defaults={'text': request.data.get('text', '')})

    return Response({"success": True, "message": "Note saved successfully!"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_book_review(request, book_id):
    # Retrieve the book object
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

    # If you're sending 'user' from the frontend, retrieve it. Otherwise, use the authenticated user.
    # Note: Allowing frontend to send 'user' can be a security concern as it can be tampered.
    if 'user' in request.data:
        user_id = request.data['user']
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        user = request.user

    # Collect data for the review
    data = {
        'rating': request.data.get('rating', None),  # Assuming rating is being sent in the request
        'comment': request.data.get('comment', '')   # Assuming comment is being sent in the request
    }

    # Update or create the review
    review, created = Review.objects.update_or_create(user=user, book=book, defaults=data)

    return Response({"success": True, "message": "Review saved successfully!"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, book_id):
    user = request.user
    book = Book.objects.get(pk=book_id)

    if user in book.favorited_by.all():
        # If book is already favorited, remove it
        book.favorited_by.remove(user)
        return Response({"status": "Book removed from favorites"})
    else:
        # If book is not favorited, add it
        book.favorited_by.add(user)
        return Response({"status": "Book added to favorites"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_books(request):
    user = request.user
    books = user.favorite_books.all().order_by('-created_at')

    # Paginate the results
    paginator = Paginator(books, 20)  # Here 20 books per page, you can adjust this number
    page = request.GET.get('page', 1)
    current_page_books = paginator.get_page(page)

    # Create serialized data list
    serialized_data = []
    for book in current_page_books:
        serialized_data.append({
            'id': book.id,
            'title': book.title,
            'cover_image': request.build_absolute_uri(book.cover_image.url) if book.cover_image else None
        })

    return JsonResponse(serialized_data, safe=False)


class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            return Response({"message": "Thank you for your interest. We'll get back to you."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Thank you for your interest. You'll receive an email once the admin approves it."},
                status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    if not email:
        return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "No account with this email address."}, status=status.HTTP_404_NOT_FOUND)

    code = ''.join(random.choice('0123456789') for i in range(6))
    PasswordResetCode.objects.create(user=user, code=code)

    send_mail(
        'Your password reset code',
        f'Your code is: {code}',
        'your_email',
        [email],
        fail_silently=False,
    )

    print(code)
    return Response({"detail": "Reset code sent to email."}, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_password_reset(request):
    email = request.data.get('email')
    code = request.data.get('code')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')

    if not all([email, code, password, confirm_password]):
        return Response({"detail": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "No account with this email address."}, status=status.HTTP_404_NOT_FOUND)

    try:
        reset_code = PasswordResetCode.objects.get(user=user, code=code)
    except PasswordResetCode.DoesNotExist:
        return Response({"detail": "Invalid code."}, status=status.HTTP_400_BAD_REQUEST)

    if reset_code.is_expired():
        reset_code.delete()
        return Response({"detail": "Code has expired."}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({"detail": "Passwords don't match."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(password)
    user.save()

    reset_code.delete()
    return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_book_pages(request, book_id):
    user = request.user
    book = Book.objects.get(pk=book_id)

    # Fetch the current_page from the request, default to 0
    current_page = int(request.GET.get('current_page', 0))
    pages_per_request = 10

    # Calculate the start and end pages for fetching
    start_page = current_page   # Start from the page next to current
    end_page = min(start_page + pages_per_request - 1, book.total_pages)  # Fetch the next set of pages without exceeding total pages

    # Fetching the images from DigitalOcean Spaces using Django's default storage
    page_images_urls = []

    for i in range(start_page, end_page + 1):
        image_name = 'ebooks/{0}/page_{1}.jpeg'.format(book_id, i)
        if default_storage.exists(image_name):
            url = settings.BASE_URL + default_storage.url(image_name)
            page_images_urls.append(url)

    return JsonResponse({'page_images': page_images_urls})
